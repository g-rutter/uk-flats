#!/usr/bin/env python3
"""Create a manifest draft for a direct National Rail capture release.

This is offline bookkeeping. It discovers immutable request, response and
metadata files written by collect_national_transport_http.py and records their
existing provenance for the hashing finalizer; it does not query the planner.
"""
import argparse
import json
from pathlib import Path

from csv_io import write_csv
from finalize_national_transport_release import DRAFT_COLUMNS


TERMS = 'National Rail website Terms and Conditions; public Journey Planner snapshot.'


def read_json(path):
    with Path(path).open(encoding='utf-8') as source:
        return json.load(source)


def draft_rows(release_dir):
    """Return complete, deterministic draft rows for direct collector artifacts."""
    release_dir = Path(release_dir)
    rows = []
    for metadata_path in sorted((release_dir / 'transport').glob('*/capture-metadata.json')):
        metadata = read_json(metadata_path)
        searches = metadata.get('searches', [])
        if not searches or not metadata.get('source_endpoint') or not metadata.get('measurement_date'):
            raise ValueError(f'{metadata_path}: incomplete direct capture metadata')
        route = metadata_path.parent.relative_to(release_dir).as_posix()
        origin = metadata.get('origin', {}).get('crs')
        destination = metadata.get('destination', {}).get('crs')
        if not origin or not destination:
            raise ValueError(f'{metadata_path}: missing route endpoint')
        limitation = metadata.get('limitations', '')
        for search in searches:
            retrieved_at = search.get('retrieved_at_local')
            request_name, response_name = search.get('request'), search.get('response')
            if not retrieved_at or not request_name or not response_name:
                raise ValueError(f'{metadata_path}: incomplete search record')
            request_path = metadata_path.parent / request_name
            response_path = metadata_path.parent / response_name
            request = read_json(request_path)
            query = json.dumps(request, separators=(',', ':'), sort_keys=True)
            for artifact in (request_path, response_path):
                rows.append({
                    'relative_path': artifact.relative_to(release_dir).as_posix(),
                    'original_url': metadata['source_endpoint'],
                    'request_query': query,
                    'retrieved_at': retrieved_at,
                    'data_period': metadata['measurement_date'],
                    'publisher': 'National Rail',
                    'licence_or_terms': TERMS,
                    'coverage_limitations': limitation,
                })
        rows.append({
            'relative_path': metadata_path.relative_to(release_dir).as_posix(),
            'original_url': metadata['source_endpoint'],
            'request_query': f'Direct capture metadata for {origin} to {destination}.',
            'retrieved_at': max(search['retrieved_at_local'] for search in searches),
            'data_period': metadata['measurement_date'],
            'publisher': 'National Rail',
            'licence_or_terms': TERMS,
            'coverage_limitations': limitation,
        })
    if not rows:
        raise ValueError(f'{release_dir}: no direct capture metadata found')
    return rows


def create(release_dir, out_path):
    """Write a new draft and refuse to overwrite an existing record."""
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
