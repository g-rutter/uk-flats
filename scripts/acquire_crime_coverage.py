#!/usr/bin/env python3
"""Snapshot Police.uk coverage evidence separately from ONS data."""
import argparse
from datetime import datetime, timezone
import hashlib
from pathlib import Path
from urllib.request import urlopen

from csv_io import write_csv

SOURCES = {
    'changelog.html': 'https://data.police.uk/changelog/',
    'availability.json': 'https://data.police.uk/api/crimes-street-dates',
}


def acquire(destination):
    destination.mkdir(parents=True, exist_ok=False)
    manifest = []
    for name, url in SOURCES.items():
        with urlopen(url, timeout=60) as response:
            payload = response.read()
        (destination / name).write_bytes(payload)
        manifest.append(dict(file=name, url=url,
                             retrieved_at=datetime.now(timezone.utc).isoformat(),
                             sha256=hashlib.sha256(payload).hexdigest()))
    write_csv(destination / 'manifest.csv', manifest)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('destination', type=Path)
    acquire(parser.parse_args().destination)
