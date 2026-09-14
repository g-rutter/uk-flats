#!/usr/bin/env python3
"""Validate retained Rightmove responses and extract headline counts offline."""
import argparse
import csv
import json
import re
from pathlib import Path

from acquire_market_stock import FIELDS, read_mappings
from csv_io import write_csv
from release_manifest import load


RESULT_COUNT = re.compile(r'"resultCount":"([0-9]+)"')
OUTPUT_FIELDS = FIELDS + ('sale_count', 'rent_count', 'capture_hashes')


def prepare(release, mappings_path, output):
    release = Path(release)
    manifest = load(release)
    rows = []
    for mapping in read_mappings(mappings_path):
        ident = mapping['location_id']
        resolver_path = f'market-stock/resolver/{ident}.json'
        matches = json.loads((release / resolver_path).read_text(encoding='utf-8')).get('matches', [])
        if not any(str(item.get('id')) == mapping['portal_region_id'] and
                   item.get('type') == 'REGION' and item.get('displayName') == mapping['portal_region_name']
                   for item in matches):
            raise ValueError(f'{ident}: reviewed Rightmove REGION mapping did not reproduce')
        counts, hashes = {}, [manifest[resolver_path]['sha256']]
        for tenure in ('sale', 'rent'):
            path = f'market-stock/search/{ident}-{tenure}.html'
            found = RESULT_COUNT.findall((release / path).read_text(encoding='utf-8'))
            if len(found) != 1:
                raise ValueError(f'{ident} {tenure}: expected one headline resultCount, found {len(found)}')
            counts[tenure] = found[0]
            hashes.append(manifest[path]['sha256'])
        rows.append({**mapping, 'sale_count': counts['sale'], 'rent_count': counts['rent'],
                     'capture_hashes': ';'.join(hashes)})
    write_csv(output, rows, OUTPUT_FIELDS)
    return rows


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', type=Path, required=True)
    parser.add_argument('--mappings', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    prepared = prepare(args.release, args.mappings, args.output)
    print(f'Prepared market-stock review for {len(prepared)} locations.')
