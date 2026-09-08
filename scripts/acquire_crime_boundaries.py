#!/usr/bin/env python3
"""Snapshot the CSP lookup and Police.uk geography definitions; do not aggregate."""
import argparse
from datetime import datetime, timezone
import hashlib
from pathlib import Path
from urllib.request import urlopen

from csv_io import write_csv

SERVICE = ('https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/'
           'LAD25_CSP25_PFA25_EW_LU/FeatureServer/0')
SOURCES = {
    'csp-item.json': 'https://www.arcgis.com/sharing/rest/content/items/8f77bda25c124e43aca5f3b90494e405?f=json',
    'csp-lookup.json': SERVICE + '/query?where=1%3D1&outFields=*&returnGeometry=false&f=json',
    'police-download.html': 'https://data.police.uk/data/',
    'police-about.html': 'https://data.police.uk/about/',
}


def acquire(destination):
    destination.mkdir(parents=True, exist_ok=False)
    manifest = []
    for name, url in SOURCES.items():
        with urlopen(url, timeout=45) as response:
            payload = response.read()
        (destination / name).write_bytes(payload)
        manifest.append(dict(file=name, url=url,
                             retrieved_at=datetime.now(timezone.utc).isoformat(),
                             sha256=hashlib.sha256(payload).hexdigest()))
        # Retain completed requests even if a later download fails.
        write_csv(destination / 'manifest.csv', manifest)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('destination', type=Path)
    acquire(parser.parse_args().destination)
