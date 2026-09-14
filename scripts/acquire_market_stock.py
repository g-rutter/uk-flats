#!/usr/bin/env python3
"""Acquire a small, dated Rightmove headline-count release with plain HTTP GETs."""
import argparse
import csv
import hashlib
import json
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen

from csv_io import write_csv


USER_AGENT = 'Mozilla/5.0 (compatible; UKFlatsResearch/1.0; controlled-light-use-capture)'
RESULT_COUNT = re.compile(rb'"resultCount":"([0-9]+)"')
FIELDS = ('location_id', 'resolver_query', 'portal_region_id', 'portal_region_name',
          'confidence', 'selection_reason')
TENURES = {
    'sale': ('property-for-sale', {
        'includeSSTC': 'false',
        'dontShow': 'retirement,sharedOwnership',
    }),
    'rent': ('property-to-rent', {
        'includeSSTC': 'true',
        'dontShow': 'houseShare,retirement',
    }),
}


def read_mappings(path):
    with Path(path).open(newline='', encoding='utf-8') as source:
        reader = csv.DictReader(source)
        if not reader.fieldnames or set(FIELDS) - set(reader.fieldnames):
            raise ValueError(f'{path}: missing market mapping columns')
        rows = list(reader)
    ids = [row['location_id'] for row in rows]
    if not rows or len(ids) != len(set(ids)) or any(not all(row[field] for field in FIELDS) for row in rows):
        raise ValueError(f'{path}: empty, duplicate or incomplete market mappings')
    return rows


def get(url, expected_types, opener=urlopen):
    request = Request(url, headers={'User-Agent': USER_AGENT, 'Accept': ', '.join(expected_types)})
    with opener(request, timeout=90) as response:
        payload = response.read()
        content_type = response.headers.get_content_type()
    if not payload or content_type not in expected_types:
        raise ValueError(f'{url}: expected {expected_types}, received {content_type}')
    return payload, content_type


def manifest_row(destination, relative_path, url, request_query, payload, content_type, limitation):
    path = destination / relative_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(payload)
    return {
        'relative_path': relative_path.as_posix(),
        'original_url': url,
        'request_query': request_query,
        'retrieved_at': datetime.now(timezone.utc).isoformat(),
        'data_period': f'Snapshot {datetime.now(timezone.utc).date().isoformat()}',
        'sha256': hashlib.sha256(payload).hexdigest(),
        'byte_size': str(len(payload)),
        'mime_type': content_type,
        'publisher': 'Rightmove',
        'licence_or_terms': 'Rightmove website terms; controlled light-use capture; no listing pages opened.',
        'coverage_limitations': limitation,
    }


def acquire(destination, mappings_path, opener=urlopen, pause_seconds=0.5):
    destination = Path(destination)
    destination.mkdir(parents=True, exist_ok=False)
    rows = []
    mappings = read_mappings(mappings_path)
    for mapping in mappings:
        ident = mapping['location_id']
        resolver_url = 'https://los.rightmove.co.uk/typeahead?' + urlencode({'query': mapping['resolver_query']})
        payload, content_type = get(resolver_url, ('application/json', 'text/json'), opener)
        matches = json.loads(payload).get('matches', [])
        expected = [item for item in matches if str(item.get('id')) == mapping['portal_region_id'] and
                    item.get('type') == 'REGION' and item.get('displayName') == mapping['portal_region_name']]
        if len(expected) != 1:
            raise ValueError(f'{ident}: reviewed Rightmove REGION mapping did not reproduce')
        rows.append(manifest_row(
            destination, Path('market-stock/resolver') / f'{ident}.json', resolver_url,
            f"GET /typeahead?query={quote(mapping['resolver_query'])}; User-Agent: {USER_AGENT}",
            payload, content_type,
            'Portal place geography is proprietary and may not match the broad comparison geography.',
        ))
        counts = {}
        for tenure, (endpoint, tenure_options) in TENURES.items():
            query = {
                'locationIdentifier': f"REGION^{mapping['portal_region_id']}",
                'minBedrooms': '1', 'maxBedrooms': '1', 'propertyTypes': 'flat',
                **tenure_options, 'mustHave': '', 'furnishTypes': '', 'keywords': '',
            }
            url = f'https://www.rightmove.co.uk/{endpoint}/find.html?' + urlencode(query)
            payload, content_type = get(url, ('text/html',), opener)
            found = RESULT_COUNT.findall(payload)
            if len(found) != 1:
                raise ValueError(f'{ident} {tenure}: expected one headline resultCount, found {len(found)}')
            counts[tenure] = int(found[0])
            rows.append(manifest_row(
                destination, Path('market-stock/search') / f'{ident}-{tenure}.html', url,
                f'GET /{endpoint}/find.html?{url.split("?", 1)[1]}; User-Agent: {USER_AGENT}',
                payload, content_type,
                'Headline advertised-result count only; listings are not opened or deduplicated. Sale and rent exclusions differ.',
            ))
            if pause_seconds:
                time.sleep(pause_seconds)
    write_csv(destination / 'manifest.csv', rows, tuple(rows[0]))
    return len(mappings)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('destination', type=Path, help='New snapshot directory (must not exist)')
    parser.add_argument('--mappings', type=Path, required=True)
    args = parser.parse_args()
    captured = acquire(args.destination, args.mappings)
    print(f'Captured sale and rent headline pages for {captured} locations.')
