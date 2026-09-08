#!/usr/bin/env python3
"""Create a manifest draft for a National Rail station-mapping capture."""
import argparse
import json
from pathlib import Path

from csv_io import write_csv
from finalize_national_transport_release import DRAFT_COLUMNS


TERMS = 'National Rail website Terms and Conditions; public Journey Planner station-picker snapshot.'


def draft_rows(release_dir):
    release_dir = Path(release_dir)
    metadata_path = release_dir / 'capture-metadata.json'
    with metadata_path.open(encoding='utf-8') as source:
        metadata = json.load(source)
    records = metadata.get('records', [])
    if not records or not metadata.get('source_endpoint'):
        raise ValueError(f'{metadata_path}: incomplete station-picker metadata')
    rows = []
    for record in records:
        response = record.get('response')
        if not all(record.get(field) for field in ('location_id', 'request_url',
                                                    'retrieved_at_local')) or not response:
            raise ValueError(f'{metadata_path}: incomplete station-picker record')
        rows.append({
            'relative_path': response,
            'original_url': record['request_url'],
            'request_query': record.get('query') or (
                f"National Rail station page for {record.get('station_name', '')} "
                f"({record.get('station_crs', '')})."),
            'retrieved_at': record['retrieved_at_local'],
            'data_period': 'Station suggestions current at retrieval.',
            'publisher': 'National Rail',
            'licence_or_terms': TERMS,
            'coverage_limitations': metadata['limitations'],
        })
    rows.append({
        'relative_path': metadata_path.name,
        'original_url': metadata['source_endpoint'],
        'request_query': 'Station-picker capture metadata.',
        'retrieved_at': max(record['retrieved_at_local'] for record in records),
        'data_period': 'Station suggestions current at retrieval.',
        'publisher': 'National Rail',
        'licence_or_terms': TERMS,
        'coverage_limitations': metadata['limitations'],
    })
    return rows


def create(release_dir, out_path):
    out_path = Path(out_path)
    if out_path.exists():
        raise ValueError(f'{out_path} already exists; refusing to replace a release draft')
    rows = draft_rows(release_dir)
    write_csv(out_path, rows, DRAFT_COLUMNS)
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', required=True, type=Path)
    parser.add_argument('--out', type=Path)
    args = parser.parse_args()
    create(args.release, args.out or args.release / 'manifest-draft.csv')


if __name__ == '__main__':
    main()
