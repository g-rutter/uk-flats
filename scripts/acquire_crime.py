#!/usr/bin/env python3
"""Acquire dated official workbooks without transforming or publishing them."""
import argparse
import csv
from datetime import datetime, timezone
import hashlib
from pathlib import Path
from urllib.request import urlopen
import zipfile

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://www.ons.gov.uk/file?uri=/peoplepopulationandcommunity/crimeandjustice/datasets/'
SOURCES = {
    'pfa.xlsx': BASE + 'policeforceareadatatables/yearendingmarch2026/pfatablesyemarch2026.xlsx',
    'appendix.xlsx': BASE + 'crimeinenglandandwalesappendixtables/yearendingmarch2026/appendixtablesyemar2026.xlsx',
}


def acquire(destination):
    destination.mkdir(parents=True, exist_ok=False)
    rows = []
    for name, url in SOURCES.items():
        with urlopen(url, timeout=60) as response:
            payload = response.read()
        path = destination / name
        path.write_bytes(payload)
        if not zipfile.is_zipfile(path):
            raise ValueError(f'Not an XLSX workbook: {url}')
        rows.append(dict(file=name, url=url,
                         retrieved_at=datetime.now(timezone.utc).isoformat(),
                         sha256=hashlib.sha256(payload).hexdigest()))
    with (destination / 'manifest.csv').open('w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=rows[0], lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('destination', type=Path, help='New snapshot directory (must not exist)')
    acquire(parser.parse_args().destination)
