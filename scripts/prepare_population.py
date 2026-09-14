#!/usr/bin/env python3
"""Aggregate Census 2021 usual residents to reviewed April 2024 BUAs."""
import argparse
import csv
from collections import defaultdict
from pathlib import Path

from csv_io import write_csv
from prepare_local_transport import read_population
from release_manifest import load as load_manifest


METHOD_VERSION = 'census2021-ts001-bua24-v1'
EVIDENCE_ID = 'POP-ONS-CENSUS-2021-BUA24'
OUTPUT_COLUMNS = (
    'location_id', 'population', 'census_date', 'retrieval_date', 'evidence_id',
    'geography_code', 'geography_name', 'geography_vintage', 'method_version',
    'confidence', 'reason',
)


def read_csv(path, encoding='utf-8'):
    with Path(path).open(newline='', encoding=encoding) as source:
        return list(csv.DictReader(source))


def prepare(release_dir, locations_path, mapping_path, components_path):
    manifest = load_manifest(release_dir)
    required = {'census2021-ts001.zip', 'oa21_bua24_best_fit.csv'}
    if not required.issubset(manifest):
        raise ValueError('Population release is missing Census or BUA lookup evidence')

    populations = read_population(release_dir / 'census2021-ts001.zip')
    bua_oas, bua_names = defaultdict(list), {}
    for row in read_csv(release_dir / 'oa21_bua24_best_fit.csv', 'utf-8-sig'):
        oa, code, name = row['OA21CD'], row['BUA24CD'], row['BUA24NM']
        if not code:
            continue
        bua_oas[code].append(oa)
        if code in bua_names and bua_names[code] != name:
            raise ValueError(f'Inconsistent BUA name for {code}')
        bua_names[code] = name

    locations = read_csv(locations_path)
    location_ids = {row['id'] for row in locations}
    mappings = {row['location_id']: row for row in read_csv(mapping_path)}
    if set(mappings) != location_ids:
        raise ValueError('Every current location needs one reviewed BUA mapping')
    components = defaultdict(list)
    for row in read_csv(components_path):
        ident, code = row['location_id'], row['geography_code']
        if ident not in mappings or code not in bua_names:
            raise ValueError(f'Unknown location or BUA component {ident}/{code}')
        if row['geography_name'] != bua_names[code] or code in components[ident]:
            raise ValueError(f'Invalid BUA component {ident}/{code}')
        components[ident].append(code)

    output = []
    for ident in sorted(location_ids):
        codes = components[ident]
        if not codes:
            raise ValueError(f'{ident}: no BUA component')
        oas = [oa for code in codes for oa in bua_oas[code]]
        if not oas or any(oa not in populations for oa in oas):
            raise ValueError(f'{ident}: incomplete Census population coverage')
        population = sum(populations[oa] for oa in oas)
        if population <= 0:
            raise ValueError(f'{ident}: non-positive Census population')
        mapping = mappings[ident]
        names = [bua_names[code] for code in codes]
        output.append({
            'location_id': ident,
            'population': str(population),
            'census_date': '2021-03-21',
            'retrieval_date': manifest['census2021-ts001.zip']['retrieved_at'],
            'evidence_id': EVIDENCE_ID,
            'geography_code': ';'.join(codes),
            'geography_name': ' + '.join(names),
            'geography_vintage': 'April 2024',
            'method_version': METHOD_VERSION,
            'confidence': mapping['confidence'],
            'reason': ('Sum of Census 2021 usual residents in Output Areas assigned by the '
                       f"official best-fit lookup to {', '.join(names)}; {mapping['reason']}"),
        })
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release-dir', type=Path,
                        default=Path('data/raw/releases/2026-09-09-local-transport'))
    parser.add_argument('--inputs-dir', type=Path, default=Path('data/inputs'))
    parser.add_argument('--output', type=Path, default=Path('data/inputs/population.csv'))
    args = parser.parse_args()
    rows = prepare(
        args.release_dir,
        args.inputs_dir / 'locations.csv',
        args.inputs_dir / 'location_geographies.csv',
        args.inputs_dir / 'location_geography_components.csv',
    )
    write_csv(args.output, rows, OUTPUT_COLUMNS)
    print(f'Prepared {len(rows)} complete population observations.')


if __name__ == '__main__':
    main()
