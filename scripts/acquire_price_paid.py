#!/usr/bin/env python3
"""Retain declared HMLR Price Paid artifacts without transforming them.

The publisher's bulk files and report-builder exports are both valid inputs.  A
caller supplies every URL and request description explicitly: this script never
guesses a query from a place name or silently changes the date range.
"""
import argparse
import csv
from datetime import datetime, timezone
import hashlib
from pathlib import Path
from urllib.request import urlopen

from csv_io import write_csv
from release_manifest import REQUIRED_COLUMNS


def read_sources(path):
    with Path(path).open(newline='', encoding='utf-8') as source:
        rows = list(csv.DictReader(source))
    required = ('relative_path', 'original_url', 'request_query', 'data_period')
    if not rows or any(not all(row.get(key, '') for key in required) for row in rows):
        raise ValueError('Source CSV needs nonblank relative_path, original_url, request_query and data_period')
    return rows


def acquire(destination, source_rows):
    if destination.exists() and not (destination / 'manifest.csv').is_file():
        raise ValueError(f'Destination exists without a release manifest: {destination}')
    destination.mkdir(parents=True, exist_ok=True)
    existing = []
    manifest_path = destination / 'manifest.csv'
    if manifest_path.exists():
        with manifest_path.open(newline='', encoding='utf-8') as source:
            existing = list(csv.DictReader(source))
        if {key for row in existing for key in row} != set(REQUIRED_COLUMNS):
            raise ValueError(f'Invalid existing manifest: {manifest_path}')
    existing_paths = {row['relative_path'] for row in existing}
    manifest_rows = []
    for source in source_rows:
        relative = Path(source['relative_path'])
        if relative.is_absolute() or '..' in relative.parts or not str(relative).startswith('price/'):
            raise ValueError(f'Unsafe or non-price artifact path: {relative}')
        if relative.as_posix() in existing_paths:
            raise ValueError(f'Artifact already retained: {relative}')
        path = destination / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        with urlopen(source['original_url'], timeout=300) as response:
            payload = response.read()
        if not payload:
            raise ValueError(f'Empty response: {source["original_url"]}')
        path.write_bytes(payload)
        manifest_rows.append(dict(zip(REQUIRED_COLUMNS, (
            relative.as_posix(), source['original_url'], source['request_query'],
            datetime.now(timezone.utc).isoformat(), source['data_period'],
            hashlib.sha256(payload).hexdigest(), source.get('mime_type') or 'text/csv',
            'HM Land Registry', source.get('licence_or_terms') or 'Open Government Licence v3.0',
            source.get('coverage_limitations') or 'Category-A transactions; registrations may lag.',
        ))))
    write_csv(manifest_path, existing + manifest_rows, REQUIRED_COLUMNS)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('destination', type=Path, help='New release directory (must not exist)')
    parser.add_argument('--sources', type=Path, required=True, help='Reviewed HMLR artifact request CSV')
    args = parser.parse_args()
    acquire(args.destination, read_sources(args.sources))
