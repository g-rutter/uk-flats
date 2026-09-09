#!/usr/bin/env python3
"""Prepare reviewed BUA-level DfT public-transport connectivity observations."""
import argparse
import csv
import math
from collections import defaultdict
from pathlib import Path
from xml.etree.ElementTree import iterparse
from zipfile import ZipFile

from csv_io import write_csv
from release_manifest import load as load_manifest


TABLE_NS = 'urn:oasis:names:tc:opendocument:xmlns:table:1.0'
OFFICE_NS = 'urn:oasis:names:tc:opendocument:xmlns:office:1.0'
TEXT_NS = 'urn:oasis:names:tc:opendocument:xmlns:text:1.0'
TABLE = f'{{{TABLE_NS}}}'
OFFICE = f'{{{OFFICE_NS}}}'
TEXT = f'{{{TEXT_NS}}}'
METRIC_COLUMN = 'Overall (public transport)'
METHOD_VERSION = 'dft-connectivity-bua24-v1'
SOURCE_PERIOD = 'Q4 2024 transport and destination data; 2023 provisional BRES employment data'
RETRIEVAL_DATE = '2026-09-09'
EVIDENCE_ID = 'TR-LOCAL-DFT-2025'
OUTPUT_COLUMNS = (
    'location_id', 'pt_connectivity_0_100', 'national_percentile', 'score',
    'source_period', 'retrieval_date', 'evidence_id', 'geography_code',
    'geography_vintage', 'population_covered', 'population_expected',
    'method_version', 'confidence', 'reason',
)
REVIEW_COLUMNS = OUTPUT_COLUMNS + ('component_count', 'oa_count', 'coverage_pct')


def read_csv(path, encoding='utf-8'):
    with Path(path).open(newline='', encoding=encoding) as source:
        return list(csv.DictReader(source))


def cell_values(row):
    values = []
    for cell in row:
        if cell.tag not in (TABLE + 'table-cell', TABLE + 'covered-table-cell'):
            continue
        value = cell.get(OFFICE + 'value')
        if value is None:
            value = ' '.join(''.join(p.itertext()) for p in cell.findall('.//' + TEXT + 'p')).strip()
        repeat = int(cell.get(TABLE + 'number-columns-repeated', '1'))
        values.extend([value] * repeat)
    return values


def read_dft_oa(path):
    """Stream the OA sheet from the large ODS and return its selected metric."""
    observations = {}
    with ZipFile(path) as archive, archive.open('content.xml') as source:
        sheet = None
        header = None
        oa_index = metric_index = None
        for event, element in iterparse(source, events=('start', 'end')):
            if event == 'start' and element.tag == TABLE + 'table':
                sheet = element.get(TABLE + 'name')
            elif event == 'end' and element.tag == TABLE + 'table-row' and sheet == 'OA':
                values = cell_values(element)
                if values and values[0] == 'OA21CD':
                    header = values
                    oa_index = header.index('OA21CD')
                    metric_index = header.index(METRIC_COLUMN)
                elif header and values and values[oa_index]:
                    code = values[oa_index]
                    raw = values[metric_index] if metric_index < len(values) else ''
                    if code in observations or not raw:
                        raise ValueError(f'DfT OA sheet: duplicate or missing {METRIC_COLUMN} for {code}')
                    value = float(raw)
                    if not math.isfinite(value) or not 0 <= value <= 100:
                        raise ValueError(f'DfT OA sheet: invalid {METRIC_COLUMN} for {code}: {raw}')
                    observations[code] = value
                element.clear()
            elif event == 'end' and element.tag == TABLE + 'table' and sheet == 'OA':
                break
            elif event == 'end' and element.tag == TABLE + 'table':
                sheet = None
                element.clear()
    if not header or not observations:
        raise ValueError('DfT ODS: OA sheet or selected metric is missing')
    return observations


def read_population(zip_path):
    member = 'census2021-ts001-oa.csv'
    with ZipFile(zip_path) as archive, archive.open(member) as raw:
        import io
        reader = csv.DictReader(io.TextIOWrapper(raw, encoding='utf-8-sig', newline=''))
        code_field = 'geography code'
        value_field = 'Residence type: Total; measures: Value'
        result = {}
        for row in reader:
            code = row[code_field]
            value = int(row[value_field])
            if code in result or value < 0:
                raise ValueError(f'Census population: duplicate or invalid OA {code}')
            result[code] = value
    return result


def read_lookup(path):
    result = {}
    names = {}
    for row in read_csv(path, 'utf-8-sig'):
        oa, code, name = row['OA21CD'], row['BUA24CD'], row['BUA24NM']
        if oa in result:
            raise ValueError(f'OA-to-BUA lookup: duplicate OA {oa}')
        result[oa] = code
        if code:
            if code in names and names[code] != name:
                raise ValueError(f'OA-to-BUA lookup: inconsistent name for {code}')
            names[code] = name
    return result, names


def read_mappings(mapping_path, components_path, location_ids, bua_names):
    mappings = {}
    for row in read_csv(mapping_path):
        ident = row['location_id']
        if ident in mappings or ident not in location_ids:
            raise ValueError(f'Location geography: duplicate or unknown location {ident}')
        if row['geography_type'] != 'bua' or row['boundary_vintage'] != 'April 2024':
            raise ValueError(f'Location geography: unsupported type/vintage for {ident}')
        if row['confidence'] not in ('High', 'Medium', 'Low') or not row['reason']:
            raise ValueError(f'Location geography: incomplete review for {ident}')
        mappings[ident] = row
    if set(mappings) != location_ids:
        raise ValueError('Location geography: every current location needs one reviewed mapping')
    components = defaultdict(list)
    for row in read_csv(components_path):
        ident, code = row['location_id'], row['geography_code']
        if ident not in mappings or code not in bua_names:
            raise ValueError(f'Location geography component: unknown location or BUA {ident}/{code}')
        if row['geography_name'] != bua_names[code]:
            raise ValueError(f'Location geography component: name mismatch for {code}')
        if code in {item['geography_code'] for item in components[ident]}:
            raise ValueError(f'Location geography component: duplicate {ident}/{code}')
        components[ident].append(row)
    if any(not components[ident] for ident in mappings):
        raise ValueError('Location geography: every mapping needs at least one BUA component')
    return mappings, components


def weighted_quantile_cutpoints(observations, populations):
    pairs = sorted((value, populations[code]) for code, value in observations.items()
                   if code in populations and populations[code] > 0)
    total = sum(weight for _, weight in pairs)
    if not pairs or total <= 0:
        raise ValueError('National reference population is empty')
    cutpoints = []
    cumulative = 0
    target_index = 1
    for value, weight in pairs:
        cumulative += weight
        while target_index <= 4 and cumulative >= total * target_index / 5:
            cutpoints.append(value)
            target_index += 1
    if len(cutpoints) != 4:
        raise ValueError('Could not calculate national quintile cut-points')
    return cutpoints, pairs, total


def score_for(value, cutpoints):
    # Equality belongs to the better band.
    return 1 + sum(value >= cutpoint for cutpoint in cutpoints)


def percentile_for(value, pairs, total):
    return 100 * sum(weight for candidate, weight in pairs if candidate <= value) / total


def prepare(dft_path, lookup_path, population_path, locations_path,
            mapping_path, components_path):
    observations = read_dft_oa(dft_path)
    populations = read_population(population_path)
    oa_to_bua, bua_names = read_lookup(lookup_path)
    location_ids = {row['id'] for row in read_csv(locations_path)}
    mappings, components = read_mappings(mapping_path, components_path, location_ids, bua_names)
    missing_population = set(observations) - set(populations)
    if missing_population:
        raise ValueError(f'Census population is missing {len(missing_population)} DfT OAs')
    cutpoints, national_pairs, national_population = weighted_quantile_cutpoints(observations, populations)
    bua_oas = defaultdict(list)
    for oa, bua in oa_to_bua.items():
        if bua:
            bua_oas[bua].append(oa)
    output = []
    for ident in sorted(location_ids):
        codes = [row['geography_code'] for row in components[ident]]
        expected_oas = [oa for code in codes for oa in bua_oas[code]]
        if any(oa not in populations for oa in expected_oas):
            raise ValueError(f'{ident}: Census population does not cover every mapped OA')
        expected_population = sum(populations.get(oa, 0) for oa in expected_oas)
        covered_oas = [oa for oa in expected_oas if oa in observations and oa in populations]
        covered_population = sum(populations[oa] for oa in covered_oas)
        if (not expected_oas or expected_population <= 0 or
                len(covered_oas) != len(expected_oas) or covered_population != expected_population):
            raise ValueError(f'{ident}: incomplete BUA coverage ({covered_population}/{expected_population})')
        raw = sum(observations[oa] * populations[oa] for oa in covered_oas) / covered_population
        mapping = mappings[ident]
        reason = (f"Population-weighted mean across {', '.join(bua_names[code] for code in codes)}; "
                  f"{mapping['reason']}")
        row = {
            'location_id': ident,
            'pt_connectivity_0_100': f'{raw:.4f}',
            'national_percentile': f'{percentile_for(raw, national_pairs, national_population):.1f}',
            'score': str(score_for(raw, cutpoints)),
            'source_period': SOURCE_PERIOD,
            'retrieval_date': RETRIEVAL_DATE,
            'evidence_id': EVIDENCE_ID,
            'geography_code': ';'.join(codes),
            'geography_vintage': 'April 2024',
            'population_covered': str(covered_population),
            'population_expected': str(expected_population),
            'method_version': METHOD_VERSION,
            'confidence': mapping['confidence'],
            'reason': reason,
            'component_count': str(len(codes)),
            'oa_count': str(len(covered_oas)),
            'coverage_pct': '100.0',
        }
        output.append(row)
    release = {
        'release_id': 'dft-connectivity-2025',
        'method_version': METHOD_VERSION,
        'metric_field': METRIC_COLUMN,
        'population_vintage': 'Census 2021',
        'geography_vintage': 'April 2024',
        'national_population': str(national_population),
        'national_oa_count': str(len(national_pairs)),
        'minimum': f'{national_pairs[0][0]:.2f}',
        'q20': f'{cutpoints[0]:.2f}',
        'q40': f'{cutpoints[1]:.2f}',
        'q60': f'{cutpoints[2]:.2f}',
        'q80': f'{cutpoints[3]:.2f}',
        'maximum': f'{national_pairs[-1][0]:.2f}',
        'boundary_rule': 'A value equal to a threshold enters the higher score band.',
    }
    return output, release


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--release-dir', type=Path, default=Path('data/raw/releases/2026-09-09-local-transport'))
    parser.add_argument('--inputs-dir', type=Path, default=Path('data/inputs'))
    parser.add_argument('--review-output', type=Path, default=Path('data/derived/local_transport_review.csv'))
    parser.add_argument('--canonical-output', type=Path)
    parser.add_argument('--release-output', type=Path)
    args = parser.parse_args()
    manifest = load_manifest(args.release_dir)
    required = {'connectivity_metrics_2025.ods', 'oa21_bua24_best_fit.csv', 'census2021-ts001.zip'}
    if set(manifest) != required:
        raise ValueError('Local-transport release manifest must contain exactly the three required artifacts')
    rows, release = prepare(
        args.release_dir / 'connectivity_metrics_2025.ods',
        args.release_dir / 'oa21_bua24_best_fit.csv',
        args.release_dir / 'census2021-ts001.zip',
        args.inputs_dir / 'locations.csv',
        args.inputs_dir / 'location_geographies.csv',
        args.inputs_dir / 'location_geography_components.csv',
    )
    write_csv(args.review_output, rows, REVIEW_COLUMNS)
    if args.canonical_output:
        canonical = [{field: row[field] for field in OUTPUT_COLUMNS} for row in rows]
        write_csv(args.canonical_output, canonical, OUTPUT_COLUMNS)
    release_output = args.release_output or args.inputs_dir / 'local_transport_release.csv'
    write_csv(release_output, [release], tuple(release))
    print(f'Prepared {len(rows)} complete local-transport observations.')


if __name__ == '__main__':
    main()
