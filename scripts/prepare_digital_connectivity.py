#!/usr/bin/env python3
"""Aggregate Ofcom residential gigabit availability to reviewed BUAs."""
import argparse
import csv
import io
import math
from collections import defaultdict
from pathlib import Path
from zipfile import ZipFile

from csv_io import write_csv
from release_manifest import load as load_manifest


ARCHIVE_MEMBER = '202501_fixed_oa_res_coverage_r01.csv'
METHOD_VERSION = 'ofcom-gigabit-bua24-v1'
SOURCE_PERIOD = 'January 2025 availability snapshot'
RETRIEVAL_DATE = '2026-09-11'
EVIDENCE_ID = 'DIGITAL-OFCOM-CN-SPRING-2025'
PREMISES_FIELD = 'All Premises'
MATCHED_FIELD = 'All Matched Premises'
GIGABIT_FIELD = 'Number of premises with Gigabit availability'
PERCENT_FIELD = 'Gigabit availability (% premises)'
OUTPUT_COLUMNS = (
    'location_id', 'gigabit_availability_pct', 'residential_premises',
    'matched_residential_premises', 'gigabit_available_premises',
    'oa_rows_covered', 'oa_rows_expected', 'source_period', 'retrieval_date',
    'evidence_id', 'geography_code', 'geography_vintage', 'method_version',
    'confidence', 'reason',
)
REVIEW_COLUMNS = OUTPUT_COLUMNS + ('component_count', 'matched_premises_pct')


def read_csv(path, encoding='utf-8'):
    with Path(path).open(newline='', encoding=encoding) as source:
        return list(csv.DictReader(source))


def read_ofcom(path):
    observations = {}
    with ZipFile(path) as archive:
        if set(archive.namelist()) != {
                '202501_fixed_oa_coverage_r01.csv', ARCHIVE_MEMBER}:
            raise ValueError('Ofcom archive does not contain the expected two OA files')
        with archive.open(ARCHIVE_MEMBER) as raw:
            reader = csv.DictReader(io.TextIOWrapper(raw, encoding='utf-8-sig', newline=''))
            required = {'output_area', PREMISES_FIELD, MATCHED_FIELD, GIGABIT_FIELD, PERCENT_FIELD}
            if not reader.fieldnames or not required.issubset(reader.fieldnames):
                raise ValueError('Ofcom residential OA file has unexpected columns')
            for row in reader:
                code = row['output_area']
                if code in observations:
                    raise ValueError(f'Ofcom residential OA file has duplicate {code}')
                premises = int(row[PREMISES_FIELD])
                matched = int(row[MATCHED_FIELD])
                gigabit = int(row[GIGABIT_FIELD])
                percent = float(row[PERCENT_FIELD])
                if (not code or min(premises, matched, gigabit) < 0 or
                        not math.isfinite(percent) or not 0 <= percent <= 100 or
                        gigabit > matched or matched > premises or premises <= 0):
                    raise ValueError(f'Ofcom residential OA file has invalid values for {code}')
                reproduced = 100 * gigabit / premises
                if abs(reproduced - percent) > 0.051:
                    raise ValueError(f'Ofcom published percentage does not match counts for {code}')
                observations[code] = {
                    'premises': premises, 'matched': matched, 'gigabit': gigabit,
                }
    if not observations:
        raise ValueError('Ofcom residential OA file is empty')
    return observations


def read_lookup(path):
    result = {}
    names = {}
    for row in read_csv(path, 'utf-8-sig'):
        oa, code, name = row['OA21CD'], row['BUA24CD'], row['BUA24NM']
        if oa in result:
            raise ValueError(f'OA-to-BUA lookup has duplicate {oa}')
        result[oa] = code
        if code:
            if code in names and names[code] != name:
                raise ValueError(f'OA-to-BUA lookup has inconsistent name for {code}')
            names[code] = name
    return result, names


def read_mappings(mapping_path, components_path, location_ids, bua_names):
    mappings = {}
    for row in read_csv(mapping_path):
        ident = row['location_id']
        if ident in mappings or ident not in location_ids:
            raise ValueError(f'Location geography has duplicate or unknown {ident}')
        if row['geography_type'] != 'bua' or row['boundary_vintage'] != 'April 2024':
            raise ValueError(f'Location geography has unsupported type/vintage for {ident}')
        if row['confidence'] not in ('High', 'Medium', 'Low') or not row['reason']:
            raise ValueError(f'Location geography has incomplete review for {ident}')
        mappings[ident] = row
    if set(mappings) != location_ids:
        raise ValueError('Every current location needs one reviewed BUA mapping')
    components = defaultdict(list)
    for row in read_csv(components_path):
        ident, code = row['location_id'], row['geography_code']
        if ident not in mappings or code not in bua_names:
            raise ValueError(f'Unknown location or BUA component {ident}/{code}')
        if code in components[ident]:
            raise ValueError(f'Duplicate location/BUA component {ident}/{code}')
        if row['geography_name'] != bua_names[code]:
            raise ValueError(f'BUA component name differs from lookup for {code}')
        components[ident].append(code)
    if any(not components[ident] for ident in mappings):
        raise ValueError('Every mapping needs at least one BUA component')
    return mappings, components


def prepare(ofcom_path, lookup_path, locations_path, mapping_path, components_path):
    observations = read_ofcom(ofcom_path)
    oa_to_bua, bua_names = read_lookup(lookup_path)
    location_ids = {row['id'] for row in read_csv(locations_path)}
    mappings, components = read_mappings(
        mapping_path, components_path, location_ids, bua_names)
    bua_oas = defaultdict(list)
    for oa, bua in oa_to_bua.items():
        if bua:
            bua_oas[bua].append(oa)
    output = []
    for ident in sorted(location_ids):
        codes = components[ident]
        expected_oas = [oa for code in codes for oa in bua_oas[code]]
        covered = [observations[oa] for oa in expected_oas if oa in observations]
        premises = sum(row['premises'] for row in covered)
        matched = sum(row['matched'] for row in covered)
        gigabit = sum(row['gigabit'] for row in covered)
        if not expected_oas or not covered or premises <= 0:
            raise ValueError(f'{ident}: Ofcom has no residential premises in the reviewed BUA')
        percent = 100 * gigabit / premises
        mapping = mappings[ident]
        reason = (
            f"Premise-weighted aggregation across {', '.join(bua_names[code] for code in codes)}; "
            f"{mapping['reason']} Ofcom OAs absent from the residential file have no residential "
            'premise row and do not enter either count.'
        )
        output.append({
            'location_id': ident,
            'gigabit_availability_pct': f'{percent:.4f}',
            'residential_premises': str(premises),
            'matched_residential_premises': str(matched),
            'gigabit_available_premises': str(gigabit),
            'oa_rows_covered': str(len(covered)),
            'oa_rows_expected': str(len(expected_oas)),
            'source_period': SOURCE_PERIOD,
            'retrieval_date': RETRIEVAL_DATE,
            'evidence_id': EVIDENCE_ID,
            'geography_code': ';'.join(codes),
            'geography_vintage': 'April 2024',
            'method_version': METHOD_VERSION,
            'confidence': mapping['confidence'],
            'reason': reason,
            'component_count': str(len(codes)),
            'matched_premises_pct': f'{100 * matched / premises:.4f}',
        })
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release-dir', type=Path,
                        default=Path('data/raw/connectivity/2026-09-11'))
    parser.add_argument('--geography-release-dir', type=Path,
                        default=Path('data/raw/releases/2026-09-09-local-transport'))
    parser.add_argument('--inputs-dir', type=Path, default=Path('data/inputs'))
    parser.add_argument('--review-output', type=Path,
                        default=Path('data/derived/digital_connectivity_review.csv'))
    parser.add_argument('--canonical-output', type=Path)
    args = parser.parse_args()
    manifest = load_manifest(args.release_dir)
    if set(manifest) != {'fixed-coverage-output-areas.zip',
                         'about-this-data-fixed-coverage.pdf'}:
        raise ValueError('Digital-connectivity release manifest is incomplete')
    geography_manifest = load_manifest(args.geography_release_dir)
    if 'oa21_bua24_best_fit.csv' not in geography_manifest:
        raise ValueError('The shared OA-to-BUA lookup is not retained')
    rows = prepare(
        args.release_dir / 'fixed-coverage-output-areas.zip',
        args.geography_release_dir / 'oa21_bua24_best_fit.csv',
        args.inputs_dir / 'locations.csv',
        args.inputs_dir / 'location_geographies.csv',
        args.inputs_dir / 'location_geography_components.csv',
    )
    write_csv(args.review_output, rows, REVIEW_COLUMNS)
    if args.canonical_output:
        canonical = [{field: row[field] for field in OUTPUT_COLUMNS} for row in rows]
        write_csv(args.canonical_output, canonical, OUTPUT_COLUMNS)
    print(f'Prepared {len(rows)} complete digital-connectivity observations.')


if __name__ == '__main__':
    main()
