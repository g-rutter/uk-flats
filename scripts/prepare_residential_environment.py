#!/usr/bin/env python3
"""Prepare BUA residential-environment observations from a retained raw release."""
import argparse
import csv
import json
import math
from collections import defaultdict
from pathlib import Path
from tempfile import TemporaryDirectory
from zipfile import ZipFile

import numpy as np
import pyogrio
import shapely
from openpyxl import load_workbook
from shapely.strtree import STRtree

from csv_io import write_csv
from release_manifest import load as load_manifest
from residential_environment import BOUNDARY_RULE, METHOD_VERSION, percentile_for, score_for, weighted_cutpoints
from prepare_local_transport import read_population


RAW_FILES = {
    'iod2025-underlying-indicators-v2.xlsx', 'wimd2025-physical-environment.csv',
    'wimd2025-housing.csv', 'defra-no2-2024.csv', 'defra-pm25-2024.csv',
    'defra-pm10-2024.csv', 'os-open-greenspace-product.json',
    'os-open-greenspace-gb.gpkg.zip',
    'oa21-population-weighted-centroids.csv', 'oa21-lsoa21-msoa21-lookup.csv',
}
PILLARS = ('air', 'quiet', 'green', 'housing_environment')
OUTPUT_COLUMNS = (
    'location_id', 'air_burden', 'no2_ug_m3', 'pm25_ug_m3', 'pm10_ug_m3',
    'noise_exposed_pct', 'green_within_300m_pct', 'green_area_within_1000m_m2',
    'epc_sap_mean', 'air_percentile', 'quiet_percentile', 'green_percentile',
    'housing_environment_percentile', 'environment_index_0_100', 'national_percentile',
    'score', 'air_period', 'quiet_period', 'green_period', 'housing_environment_period',
    'air_evidence_id', 'quiet_evidence_id', 'green_evidence_id', 'housing_environment_evidence_id',
    'geography_code', 'geography_vintage', 'air_population_covered', 'quiet_population_covered',
    'green_population_covered', 'housing_environment_population_covered', 'population_expected',
    'method_version', 'confidence', 'reason',
)
AUDIT_COLUMNS = ('bua_code', 'bua_name',) + OUTPUT_COLUMNS[1:] + ('exclusion_reason',)


def read_csv(path):
    with Path(path).open(newline='', encoding='utf-8-sig') as source:
        return list(csv.DictReader(source))


def keyed(rows, key, value):
    result = {}
    for row in rows:
        if row[key] in result:
            raise ValueError(f'duplicate {key}: {row[key]}')
        result[row[key]] = value(row)
    return result


def read_defra(path):
    with Path(path).open(newline='', encoding='utf-8-sig') as source:
        reader = csv.reader(source)
        metadata = [next(reader) for _ in range(5)]
        header = next(reader)
        value_index = 3
        if (metadata[1][0] != '2024' or metadata[2][0] != 'annual mean' or
                not metadata[3][0].startswith('ug m-3')):
            raise ValueError(f'{path}: unexpected period, metric or unit')
        result = {}
        for row in reader:
            if len(row) < 4 or row[value_index] == 'MISSING':
                continue
            result[(int(row[1]), int(row[2]))] = float(row[value_index])
    return result


def nearest_grid_value(grid, x, y):
    centre = (math.floor(x / 1000) * 1000 + 500, math.floor(y / 1000) * 1000 + 500)
    if centre in grid:
        return grid[centre], False
    for radius in range(1, 6):
        candidates = [(grid[(centre[0] + dx * 1000, centre[1] + dy * 1000)], dx * dx + dy * dy)
                      for dx in range(-radius, radius + 1) for dy in range(-radius, radius + 1)
                      if (centre[0] + dx * 1000, centre[1] + dy * 1000) in grid]
        if candidates:
            return min(candidates, key=lambda item: item[1])[0], True
    raise ValueError(f'No Defra grid value near {x},{y}')


def read_english_indicators(path):
    ws = load_workbook(path, read_only=True, data_only=True)['IoD25 Living Env Domain']
    rows = ws.iter_rows(values_only=True)
    header = list(next(rows)); positions = {name: header.index(name) for name in header}
    result = {}
    for row in rows:
        code = row[positions['LSOA code (2021)']]
        deprivation = row[positions['Housing energy performance deprivation Score']]
        noise = row[positions['Noise pollution']]
        if code and deprivation is not None and noise is not None:
            result[code] = {'epc': 100 - float(deprivation), 'noise': 100 * float(noise)}
    return result


def read_welsh_indicators(physical_path, housing_path):
    physical = defaultdict(dict)
    for row in read_csv(physical_path):
        code, indicator, raw = row['Area code_reference'], row['Indicator_reference'], row['Data values']
        if code.startswith('W01') and raw and raw != '[x]':
            physical[code][indicator] = float(raw)
    housing = {}
    for row in read_csv(housing_path):
        code, indicator, raw = row['Area code_reference'], row['Indicator_reference'], row['Data values']
        if code.startswith('W01') and indicator == 'epc' and raw and raw != '[x]':
            housing[code] = float(raw)
    result = {}
    for code, values in physical.items():
        if 'nopu' in values and code in housing:
            result[code] = {'noise': values['nopu'], 'epc': housing[code]}
    return result


def _polygonal(geometry):
    """Retain only polygonal parts after deterministic make-valid repair."""
    if geometry.is_empty:
        return geometry
    if geometry.geom_type in ('Polygon', 'MultiPolygon'):
        return geometry
    parts = [part for part in shapely.get_parts(geometry)
             if part.geom_type in ('Polygon', 'MultiPolygon') and not part.is_empty]
    return shapely.union_all(parts) if parts else shapely.GeometryCollection()


def read_green_metrics(archive_path, product_path, centroids):
    """Calculate the frozen OS Open Greenspace observation for every supplied OA."""
    product = json.loads(Path(product_path).read_text(encoding='utf-8'))
    if product.get('id') != 'OpenGreenspace' or not product.get('version'):
        raise ValueError('Invalid retained OS Open Greenspace product metadata')
    with TemporaryDirectory(prefix='residential-environment-green-') as temporary:
        member = 'Data/opgrsp_gb.gpkg'
        with ZipFile(archive_path) as archive:
            if member not in archive.namelist():
                raise ValueError(f'{archive_path}: missing {member}')
            archive.extract(member, temporary)
        gpkg = Path(temporary) / member
        layers = {name: geometry_type for name, geometry_type in pyogrio.list_layers(gpkg)}
        if layers.get('greenspace_site') != 'MultiPolygon':
            raise ValueError('OS Open Greenspace has an unexpected greenspace_site layer')
        info = pyogrio.read_info(gpkg, layer='greenspace_site')
        if info['crs'] != 'EPSG:27700' or not {'id', 'function'} <= set(info['fields']):
            raise ValueError('OS Open Greenspace has an unexpected CRS or schema')
        frame = pyogrio.read_dataframe(
            gpkg, layer='greenspace_site', columns=['id', 'function'],
            where="function IN ('Public Park Or Garden', 'Playing Field')")

    if frame.empty or frame['id'].isna().any() or frame.geometry.isna().any():
        raise ValueError('OS Open Greenspace eligible sites contain empty identifiers or geometry')
    functions = set(frame['function'])
    if functions != {'Public Park Or Garden', 'Playing Field'}:
        raise ValueError(f'OS Open Greenspace eligibility filter returned {sorted(functions)}')
    source_eligible_features = len(frame)
    duplicate_ids = int(frame['id'].duplicated(keep=False).sum())
    if duplicate_ids:
        for _, group in frame[frame['id'].duplicated(keep=False)].groupby('id'):
            if len(set(group.geometry.to_wkb())) != 1 or len(set(group['function'])) != 1:
                raise ValueError('OS Open Greenspace repeats an ID with conflicting observations')
        frame = frame.drop_duplicates('id', keep='first')
    duplicate_geometries = int(frame.geometry.to_wkb().duplicated().sum())
    invalid_before = int((~frame.geometry.is_valid).sum())
    repaired = [_polygonal(shapely.make_valid(geometry)) for geometry in frame.geometry]
    empty_after_repair = sum(geometry.is_empty for geometry in repaired)
    if empty_after_repair:
        raise ValueError('OS Open Greenspace repair produced empty eligible geometry')

    coordinates = np.asarray([centroids[oa] for oa in centroids], dtype=float)
    if len(coordinates) == 0 or not np.isfinite(coordinates).all():
        raise ValueError('No valid OA population-weighted origins for green-space calculation')
    min_x, min_y = coordinates.min(axis=0) - 1000
    max_x, max_y = coordinates.max(axis=0) + 1000
    relevant = [geometry for geometry in repaired
                if shapely.intersects(geometry, shapely.box(min_x, min_y, max_x, max_y))]
    coverage = shapely.union_all(relevant)
    union_parts = np.asarray([part for part in shapely.get_parts(coverage)
                              if part.geom_type in ('Polygon', 'MultiPolygon') and not part.is_empty], dtype=object)
    if not len(union_parts):
        raise ValueError('OS Open Greenspace union is empty')

    points = shapely.points(coordinates[:, 0], coordinates[:, 1])
    tree = STRtree(union_parts)
    nearest_pairs, distances = tree.query_nearest(points, return_distance=True, all_matches=False)
    if len(distances) != len(points) or len(set(nearest_pairs[0])) != len(points):
        raise ValueError('Not every OA origin resolved to one nearest eligible green polygon')
    nearest_by_origin = np.empty(len(points), dtype=float)
    nearest_by_origin[nearest_pairs[0]] = distances

    areas = np.zeros(len(points), dtype=float)
    chunk_size = 5000
    for start in range(0, len(points), chunk_size):
        stop = min(start + chunk_size, len(points))
        buffers = shapely.buffer(points[start:stop], 1000, quad_segs=32)
        pairs = tree.query(buffers, predicate='intersects')
        if pairs.size:
            clipped = shapely.intersection(buffers[pairs[0]], union_parts[pairs[1]])
            areas[start:stop] = np.bincount(
                pairs[0], weights=shapely.area(clipped), minlength=stop - start)

    result = {
        oa: {'proximity': 100.0 if nearest_by_origin[index] <= 300 else 0.0,
             'provision': float(areas[index])}
        for index, oa in enumerate(centroids)
    }
    audit = {
        'green_source_version': product['version'],
        'green_eligible_functions': 'Public Park Or Garden;Playing Field',
        'green_access_points_used': 'false',
        'green_source_eligible_feature_count': str(source_eligible_features),
        'green_duplicate_id_row_count': str(duplicate_ids),
        'green_duplicate_geometry_count': str(duplicate_geometries),
        'green_duplicate_handling': ('identical IDs collapse; conflicting IDs fail; '
                                     'polygon union counts overlapping area once'),
        'green_invalid_geometry_repaired_count': str(invalid_before),
        'green_empty_geometry_after_repair_count': str(empty_after_repair),
        'green_geometry_repair_operation': 'Shapely make_valid; retain polygonal parts; fail if empty',
        'green_relevant_feature_count': str(len(relevant)),
        'green_union_part_count': str(len(union_parts)),
        'green_origin_count': str(len(points)),
        'green_unmatched_origin_count': '0',
        'green_distance_crs': 'EPSG:27700',
        'green_distance_predicate': 'nearest_distance <= 300 metres',
        'green_area_predicate': 'area(union(eligible) intersect closed 1000 metre buffer)',
        'green_buffer_quad_segs': '32',
        'green_coverage_rule': 'covered population must equal expected population',
    }
    return result, audit


def weighted(values, populations):
    pairs = [(values[code], populations[code]) for code in values if code in populations and populations[code] > 0]
    return sum(value * population for value, population in pairs) / sum(population for _, population in pairs) if pairs else None


def prepare(raw_dir, shared_release_dir, inputs_dir):
    raw_manifest = load_manifest(raw_dir)
    if set(raw_manifest) != RAW_FILES:
        raise ValueError('Residential-environment manifest does not match the required release')
    shared = load_manifest(shared_release_dir)
    if set(shared) != {'connectivity_metrics_2025.ods', 'oa21_bua24_best_fit.csv', 'census2021-ts001.zip'}:
        raise ValueError('Shared local-transport release is invalid')
    population = read_population(shared_release_dir / 'census2021-ts001.zip')
    oa_bua_rows = read_csv(shared_release_dir / 'oa21_bua24_best_fit.csv')
    oa_to_bua = {row['OA21CD']: row['BUA24CD'] for row in oa_bua_rows}; bua_names = {row['BUA24CD']: row['BUA24NM'] for row in oa_bua_rows if row['BUA24CD']}
    centroids = keyed(read_csv(raw_dir / 'oa21-population-weighted-centroids.csv'), 'OA21CD', lambda row: (float(row['X']), float(row['Y'])))
    oa_lsoa21 = keyed(read_csv(raw_dir / 'oa21-lsoa21-msoa21-lookup.csv'), 'OA21CD', lambda row: row['LSOA21CD'])
    english = read_english_indicators(raw_dir / 'iod2025-underlying-indicators-v2.xlsx')
    welsh = read_welsh_indicators(raw_dir / 'wimd2025-physical-environment.csv', raw_dir / 'wimd2025-housing.csv')
    lsoa_indicators = dict(english, **welsh)
    green_centroids = {oa: centroids[oa] for oa, bua in oa_to_bua.items()
                       if bua and oa in population and oa in centroids}
    green_by_oa, green_audit = read_green_metrics(
        raw_dir / 'os-open-greenspace-gb.gpkg.zip',
        raw_dir / 'os-open-greenspace-product.json', green_centroids)
    expected_green_period = f"OS Open Greenspace {green_audit['green_source_version']}"
    if any(raw_manifest[name]['data_period'] != expected_green_period for name in
           ('os-open-greenspace-product.json', 'os-open-greenspace-gb.gpkg.zip')):
        raise ValueError('OS Open Greenspace manifest period differs from retained product metadata')
    grids = {name: read_defra(raw_dir / filename) for name, filename in
             [('no2', 'defra-no2-2024.csv'), ('pm25', 'defra-pm25-2024.csv'), ('pm10', 'defra-pm10-2024.csv')]}

    oa_values, air_fallbacks = {}, 0
    for oa, pop in population.items():
        if oa not in oa_to_bua or not oa_to_bua[oa] or oa not in centroids or oa not in oa_lsoa21:
            continue
        x, y = centroids[oa]; values = {}
        for pollutant, grid in grids.items():
            values[pollutant], fallback = nearest_grid_value(grid, x, y); air_fallbacks += int(fallback)
        values['air_burden'] = (values['no2'] / 10 + values['pm25'] / 5 + values['pm10'] / 15) / 3
        # Both 2025 indicator releases identify their observations by 2021 LSOA.
        # Use the exact OA21-to-LSOA21 relationship in both countries.  Routing
        # Welsh observations through predecessor LSOA11 codes loses replacement
        # areas such as Coity Higher 1--4 (W01001981--W01001984).
        values.update(lsoa_indicators.get(oa_lsoa21[oa], {}))
        values.update({f'green_{field}': value for field, value in green_by_oa[oa].items()})
        oa_values[oa] = values

    bua_oas = defaultdict(list)
    for oa, bua in oa_to_bua.items():
        if bua and oa in population:
            bua_oas[bua].append(oa)
    raw_buas = {}
    pillar_fields = {'air': ('air_burden', 'no2', 'pm25', 'pm10'), 'quiet': ('noise',),
                     'green': ('green_proximity', 'green_provision'), 'housing_environment': ('epc',)}
    for bua, oas in bua_oas.items():
        expected = sum(population[oa] for oa in oas)
        row = {'bua_code': bua, 'bua_name': bua_names[bua], 'population_expected': expected}
        for pillar, fields in pillar_fields.items():
            covered = [oa for oa in oas if oa in oa_values and all(field in oa_values[oa] for field in fields)]
            row[f'{pillar}_population_covered'] = sum(population[oa] for oa in covered)
            for field in fields:
                row[field] = weighted({oa: oa_values[oa][field] for oa in covered}, population)
        raw_buas[bua] = row

    complete = {code: row for code, row in raw_buas.items()
                if all(row[f'{pillar}_population_covered'] == row['population_expected'] > 0 for pillar in PILLARS)}
    if not complete:
        raise ValueError('No complete national BUA observations')
    populations_by_bua = {code: row['population_expected'] for code, row in complete.items()}
    distributions = {
        'air': [(row['air_burden'], populations_by_bua[code]) for code, row in complete.items()],
        'quiet': [(row['noise'], populations_by_bua[code]) for code, row in complete.items()],
        'green_proximity': [(row['green_proximity'], populations_by_bua[code]) for code, row in complete.items()],
        'green_provision': [(row['green_provision'], populations_by_bua[code]) for code, row in complete.items()],
        'housing': [(row['epc'], populations_by_bua[code]) for code, row in complete.items()],
    }
    def assign_pillar_percentiles(row):
        row['air_percentile'] = percentile_for(row['air_burden'], distributions['air'], True)
        row['quiet_percentile'] = percentile_for(row['noise'], distributions['quiet'], True)
        row['green_percentile'] = (percentile_for(row['green_proximity'], distributions['green_proximity']) +
                                   percentile_for(row['green_provision'], distributions['green_provision'])) / 2
        row['housing_environment_percentile'] = percentile_for(row['epc'], distributions['housing'])
        row['environment_index'] = sum(row[f'{pillar}_percentile'] for pillar in PILLARS) / 4
    for row in complete.values():
        assign_pillar_percentiles(row)
    index_distribution = [(row['environment_index'], populations_by_bua[code]) for code, row in complete.items()]
    cutpoints = weighted_cutpoints(index_distribution)
    for row in complete.values():
        row['national_percentile'] = percentile_for(row['environment_index'], index_distribution)
        row['score'] = score_for(row['environment_index'], cutpoints)

    def format_row(row, ident='', codes=()):
        reason = ('Population-weighted across the reviewed April 2024 built-up area; '
                  'air uses OA population-weighted centroids, small-area indicators use exact-fit lookups, '
                  'and green space uses current OA origins and the union of eligible OS Open Greenspace polygons.')
        return {
            'location_id': ident, 'air_burden': f"{row['air_burden']:.4f}", 'no2_ug_m3': f"{row['no2']:.3f}",
            'pm25_ug_m3': f"{row['pm25']:.3f}", 'pm10_ug_m3': f"{row['pm10']:.3f}",
            'noise_exposed_pct': f"{row['noise']:.3f}", 'green_within_300m_pct': f"{row['green_proximity']:.3f}",
            'green_area_within_1000m_m2': f"{row['green_provision']:.2f}", 'epc_sap_mean': f"{row['epc']:.3f}",
            'air_percentile': f"{row['air_percentile']:.3f}", 'quiet_percentile': f"{row['quiet_percentile']:.3f}",
            'green_percentile': f"{row['green_percentile']:.3f}",
            'housing_environment_percentile': f"{row['housing_environment_percentile']:.3f}",
            'environment_index_0_100': f"{row['environment_index']:.3f}",
            'national_percentile': f"{row['national_percentile']:.3f}", 'score': str(row['score']),
            'air_period': '2024 annual mean', 'quiet_period': '2021 strategic noise model',
            'green_period': f"OS Open Greenspace {green_audit['green_source_version']}",
            'housing_environment_period': 'EPCs 2012-2024',
            'air_evidence_id': 'ENV-AIR-DEFRA-2024', 'quiet_evidence_id': 'ENV-NOISE-IOD-WIMD-2025',
            'green_evidence_id': 'ENV-GREEN-OS-OPEN-2026-04',
            'housing_environment_evidence_id': 'ENV-EPC-IOD-WIMD-2025',
            'geography_code': ';'.join(codes), 'geography_vintage': 'April 2024',
            **{f'{pillar}_population_covered': str(row[f'{pillar}_population_covered']) for pillar in PILLARS},
            'population_expected': str(row['population_expected']), 'method_version': METHOD_VERSION,
            'confidence': 'Medium', 'reason': reason,
        }

    locations = {row['id'] for row in read_csv(inputs_dir / 'locations.csv')}
    components = defaultdict(list)
    for row in read_csv(inputs_dir / 'location_geography_components.csv'):
        components[row['location_id']].append(row['geography_code'])
    incomplete_locations = []
    for ident in sorted(locations):
        codes = components.get(ident, [])
        if codes and all(code in complete for code in codes):
            continue
        details = []
        for code in codes:
            row = raw_buas.get(code)
            if not row:
                details.append(f'{code}: absent')
            else:
                missing = [f'{pillar}={row[f"{pillar}_population_covered"]}/{row["population_expected"]}'
                           for pillar in PILLARS
                           if row[f'{pillar}_population_covered'] != row['population_expected']]
                details.append(f'{code}: {", ".join(missing) or "not in complete reference"}')
        incomplete_locations.append(f'{ident} ({"; ".join(details) or "no geography components"})')
    if incomplete_locations:
        raise ValueError('Residential environment is incomplete: ' + '; '.join(incomplete_locations))

    output = []
    for ident in sorted(locations):
        codes = components.get(ident, [])
        expected = sum(complete[code]['population_expected'] for code in codes)
        combined = {'population_expected': expected}
        raw_fields = ('air_burden', 'no2', 'pm25', 'pm10', 'noise',
                      'green_proximity', 'green_provision', 'epc')
        for field in raw_fields:
            combined[field] = sum(complete[code][field] * complete[code]['population_expected'] for code in codes) / expected
        for pillar in PILLARS:
            combined[f'{pillar}_population_covered'] = sum(complete[code][f'{pillar}_population_covered'] for code in codes)
        assign_pillar_percentiles(combined)
        combined['national_percentile'] = percentile_for(combined['environment_index'], index_distribution)
        combined['score'] = score_for(combined['environment_index'], cutpoints)
        output.append(format_row(combined, ident, codes))

    audits = []
    for code, row in sorted(raw_buas.items()):
        if code in complete:
            audit = {'bua_code': code, 'bua_name': row['bua_name'], **format_row(row)}
            audit.pop('location_id')
            audit['exclusion_reason'] = ''
        else:
            audit = {'bua_code': code, 'bua_name': row['bua_name'], 'population_expected': row['population_expected'],
                     'exclusion_reason': '; '.join(p for p in PILLARS if row[f'{p}_population_covered'] != row['population_expected'])}
            for pillar in PILLARS:
                audit[f'{pillar}_population_covered'] = row[f'{pillar}_population_covered']
        audits.append(audit)
    release = {
        'release_id': 'residential-environment-2026-09-09-v2', 'method_version': METHOD_VERSION,
        'reference_bua_count': str(len(complete)), 'reference_population': str(sum(populations_by_bua.values())),
        'q20': f'{cutpoints[0]:.3f}', 'q40': f'{cutpoints[1]:.3f}', 'q60': f'{cutpoints[2]:.3f}',
        'q80': f'{cutpoints[3]:.3f}', 'boundary_rule': BOUNDARY_RULE,
        'pillar_weights': 'air=25;quiet=25;green=25;housing_environment=25',
        'air_grid_nearest_fallback_oa_count': str(air_fallbacks),
        **green_audit,
    }
    return output, audits, release


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release-dir', type=Path, default=Path('data/raw/environment/2026-09-09'))
    parser.add_argument('--shared-release-dir', type=Path, default=Path('data/raw/releases/2026-09-09-local-transport'))
    parser.add_argument('--inputs-dir', type=Path, default=Path('data/inputs'))
    parser.add_argument('--canonical-output', type=Path, default=Path('data/inputs/residential_environment.csv'))
    parser.add_argument('--release-output', type=Path, default=Path('data/inputs/residential_environment_release.csv'))
    parser.add_argument('--audit-output', type=Path, default=Path('data/derived/residential_environment_bua_audit.csv'))
    args = parser.parse_args()
    rows, audit, release = prepare(args.release_dir, args.shared_release_dir, args.inputs_dir)
    write_csv(args.canonical_output, rows, OUTPUT_COLUMNS)
    write_csv(args.audit_output, audit, AUDIT_COLUMNS)
    write_csv(args.release_output, [release], release)
    print(f'Prepared {len(rows)} candidate locations from {release["reference_bua_count"]} complete BUAs.')


if __name__ == '__main__':
    main()
