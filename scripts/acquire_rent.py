#!/usr/bin/env python3
"""Retain the ONS PIPR edition used by the July-2026 baseline probe."""
import argparse
import csv
from datetime import datetime, timezone
import hashlib
from pathlib import Path
from urllib.request import Request, urlopen
import zipfile

from csv_io import write_csv
from release_manifest import REQUIRED_COLUMNS

ROOT = Path(__file__).resolve().parents[1]
JULY_2026_URL = ('https://www.ons.gov.uk/file?uri=/economy/inflationandpriceindices/'
                 'datasets/priceindexofprivaterentsukmonthlypricestatistics/'
                 '19august2026/priceindexofprivaterentsukmonthlypricestatistics.xlsx')


def write_manifest(destination, payload, url):
    path = destination / 'rent' / 'pipr-2026-08-19.xlsx'
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(payload)
    if not zipfile.is_zipfile(path):
        raise ValueError('ONS response was not an XLSX workbook')
    row = dict(zip(REQUIRED_COLUMNS, (
        'rent/pipr-2026-08-19.xlsx', url, 'ONS archived dataset edition: 19 August 2026',
        datetime.now(timezone.utc).isoformat(), '2026-07', hashlib.sha256(payload).hexdigest(),
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Office for National Statistics', 'Open Government Licence v3.0',
        'Modelled LA means; July 2026 values may have been provisional.',
    )))
    manifest = destination / 'manifest.csv'
    if manifest.exists():
        with manifest.open(newline='', encoding='utf-8') as source:
            existing = list(csv.DictReader(source))
        if any(item['relative_path'] == row['relative_path'] for item in existing):
            raise ValueError(f'Manifest already contains {row["relative_path"]}')
    else:
        destination.mkdir(parents=True, exist_ok=True)
        existing = []
    write_csv(manifest, existing + [row], REQUIRED_COLUMNS)


def acquire(destination, url=JULY_2026_URL):
    expected = destination / 'rent' / 'pipr-2026-08-19.xlsx'
    if destination.exists() and not (destination / 'manifest.csv').is_file() and not expected.is_file():
        raise ValueError(f'Destination exists without a recoverable rent artifact: {destination}')
    request = Request(url, headers={'User-Agent': 'uk-flats reproducibility probe (contact: repository maintainer)'})
    with urlopen(request, timeout=120) as response:
        payload = response.read()
    write_manifest(destination, payload, url)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('destination', type=Path, help='New release directory (must not exist)')
    parser.add_argument('--url', default=JULY_2026_URL, help='Archived ONS workbook URL')
    args = parser.parse_args()
    acquire(args.destination, args.url)
