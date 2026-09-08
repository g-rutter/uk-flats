#!/usr/bin/env python3
"""Append controlled Rightmove capture metadata to an expansion release manifest."""
import csv
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

from extract_legacy import write_csv
from release_manifest import REQUIRED_COLUMNS, read_csv


ROOT = Path(__file__).resolve().parents[1]
RELEASE = ROOT / 'data/raw/releases/2026-09-07-location-expansion'
USER_AGENT = 'Mozilla/5.0 (compatible; UKFlatsResearch/1.0; controlled-manual-capture)'
QUERIES = {
    'bristol': 'Bristol', 'southampton': 'Southampton', 'bournemouth': 'Bournemouth',
    'poole': 'Poole', 'brighton': 'Brighton', 'hove': 'Hove', 'exeter': 'Exeter',
    'reading': 'Reading', 'milton-keynes': 'Milton Keynes', 'luton': 'Luton',
    'southend-on-sea': 'Southend On Sea', 'cambridge': 'Cambridge', 'colchester': 'Colchester',
    'oxford': 'Oxford', 'bath': 'Bath', 'bridgend': 'Bridgend', 'llanelli': 'Llanelli',
    'bangor': 'Bangor', 'rhyl': 'Rhyl', 'york': 'York', 'durham': 'Durham',
    'cheltenham': 'Cheltenham',
}
REGIONS = {
    'bristol': '219', 'southampton': '1231', 'bournemouth-poole-bournemouth': '194',
    'bournemouth-poole-poole': '1079', 'brighton-hove': '61480', 'exeter': '494',
    'reading': '1114', 'milton-keynes': '940', 'luton': '876', 'southend-on-sea': '1232',
    'cambridge': '274', 'colchester': '347', 'oxford': '1036', 'bath': '116',
    'bridgend': '210', 'llanelli': '827', 'bangor': '98', 'rhyl': '1125', 'york': '1498',
    'durham': '460', 'cheltenham': '308',
}


def timestamp(path):
    return datetime.fromtimestamp(path.stat().st_mtime, timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def row(path, url, request, publisher, terms, limitation):
    return dict(zip(REQUIRED_COLUMNS, (
        path.relative_to(RELEASE).as_posix(), url, request, timestamp(path), 'Snapshot 2026-09-07',
        hashlib.sha256(path.read_bytes()).hexdigest(),
        'application/json' if path.suffix == '.json' else 'text/html', publisher, terms, limitation,
    )))


def rows():
    result = []
    for ident, query in QUERIES.items():
        path = RELEASE / 'market-stock/resolver' / f'{ident}.json'
        result.append(row(path, f'https://los.rightmove.co.uk/typeahead?query={query.replace(" ", "%20")}',
            f'GET /typeahead?query={query}; User-Agent: {USER_AGENT}', 'Rightmove',
            'Rightmove website terms; controlled light-use manual capture, no listing pages opened.',
            'Portal place geography is proprietary and may not match the broad comparison geography.'))
    for ident, region in REGIONS.items():
        for tenure, endpoint, extras in (
            ('sale', 'property-for-sale', 'includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership'),
            ('rent', 'property-to-rent', 'includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement'),
        ):
            path = RELEASE / 'market-stock/search' / f'{ident}-{tenure}.html'
            query = f'locationIdentifier=REGION%5E{region}&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&{extras}&furnishTypes=&keywords='
            result.append(row(path, f'https://www.rightmove.co.uk/{endpoint}/find.html?{query}',
                f'GET /{endpoint}/find.html?{query}; User-Agent: {USER_AGENT}', 'Rightmove',
                'Rightmove website terms; controlled light-use manual capture, no listing pages opened.',
                'Headline advertised-result count only; listings are not deduplicated. Sale and rent exclusions differ.'))
    return result


def main():
    manifest = RELEASE / 'manifest.csv'
    existing = read_csv(manifest)
    additions = rows()
    paths = [item['relative_path'] for item in existing]
    if len(paths) != len(set(paths)) or set(paths) & {item['relative_path'] for item in additions}:
        raise ValueError('Manifest already contains a duplicate controlled market capture')
    write_csv(manifest, existing + additions, REQUIRED_COLUMNS)
    print(f'Recorded {len(additions)} market-stock artifacts.')


if __name__ == '__main__':
    main()
