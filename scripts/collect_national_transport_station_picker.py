#!/usr/bin/env python3
"""Retain National Rail station-picker responses for broad-place mappings.

This collector only records the public Journey Planner's station suggestions.
Station choice stays a documented review decision in transport_stations.csv.
"""
import argparse
import csv
import json
from datetime import datetime
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo


ENDPOINT = 'https://stationpicker.nationalrail.co.uk'
LONDON = ZoneInfo('Europe/London')
REQUEST_HEADERS = {
    'Accept': 'application/json',
    'X-JP-Platform': 'DESKTOP',
    'Origin': 'https://www.nationalrail.co.uk',
    'Referer': 'https://www.nationalrail.co.uk/',
    'User-Agent': 'Mozilla/5.0 (compatible; uk-flats-national-transport-collector/1.0)',
}


def read_locations(path):
    with Path(path).open(newline='', encoding='utf-8') as source:
        return list(csv.DictReader(source))


def fetch(query, endpoint=ENDPOINT):
    url = f'{endpoint}/{quote(query, safe="")}'
    request = Request(url, headers=REQUEST_HEADERS)
    with urlopen(request, timeout=30) as response:
        return url, json.load(response)


def collect(locations_path, mapped_location_ids, out_dir, endpoint=ENDPOINT):
    """Save one exact-name response and metadata record for every unmapped place."""
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    metadata_path = out_dir / 'capture-metadata.json'
    if metadata_path.exists():
        raise ValueError(f'Refusing to overwrite retained metadata: {metadata_path}')
    records = []
    for location in read_locations(locations_path):
        location_id, query = location['id'], location['name']
        if location_id in mapped_location_ids:
            continue
        response_path = out_dir / f'{location_id}.json'
        if response_path.exists():
            raise ValueError(f'Refusing to overwrite retained capture: {response_path}')
        url, response = fetch(query, endpoint)
        retrieved_at = datetime.now(LONDON).isoformat(timespec='seconds')
        response_path.write_text(json.dumps(response, indent=2) + '\n', encoding='utf-8')
        records.append({
            'location_id': location_id, 'location_name': query, 'query': query,
            'request_url': url, 'response': response_path.name,
            'retrieved_at_local': retrieved_at,
        })
    metadata = {
        'source_endpoint': endpoint,
        'records': records,
        'limitations': ('Exact broad-place name queries only. The response supplies planner station '
                        'suggestions; selection remains a documented representative-station review.'),
    }
    metadata_path.write_text(json.dumps(metadata, indent=2) + '\n', encoding='utf-8')
    return metadata


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--locations', default='data/inputs/locations.csv', type=Path)
    parser.add_argument('--mapped-stations', default='data/inputs/transport_stations.csv', type=Path)
    parser.add_argument('--out-dir', required=True, type=Path)
    parser.add_argument('--endpoint', default=ENDPOINT)
    args = parser.parse_args()
    mapped = {row['location_id'] for row in read_locations(args.mapped_stations)}
    collect(args.locations, mapped, args.out_dir, args.endpoint)


if __name__ == '__main__':
    main()
