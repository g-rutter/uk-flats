#!/usr/bin/env python3
"""Retain National Rail station pages that verify reviewed CRS mappings."""
import argparse
import csv
import html
import json
import re
import unicodedata
from datetime import datetime
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo


ENDPOINT = 'https://www.nationalrail.co.uk/stations'
LONDON = ZoneInfo('Europe/London')
REQUEST_HEADERS = {
    'Accept': 'text/html,application/xhtml+xml',
    'User-Agent': 'Mozilla/5.0 (compatible; uk-flats-national-transport-collector/1.0)',
}
SLUG_OVERRIDES = {
    'Newport (South Wales)': 'newport-south-wales',
    'Portsmouth & Southsea': 'portsmouth-southsea',
    'Preston (Lancs)': 'preston-lancs',
    'Swindon (Wilts)': 'swindon-wilts',
}


def read_rows(path):
    with Path(path).open(newline='', encoding='utf-8') as source:
        return list(csv.DictReader(source))


def slug(name):
    if name in SLUG_OVERRIDES:
        return SLUG_OVERRIDES[name]
    normalized = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode('ascii')
    normalized = normalized.lower().replace('&', ' and ')
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', normalized)).strip('-')


def fetch(station_name, endpoint=ENDPOINT):
    station_slug = slug(station_name)
    url = f'{endpoint}/{station_slug}/'
    request = Request(url, headers=REQUEST_HEADERS)
    try:
        with urlopen(request, timeout=30) as response:
            return url, response.read().decode('utf-8')
    except HTTPError as error:
        raise ValueError(f'{station_name}: National Rail station page {url} returned HTTP {error.code}') from error


def page_station(html_text):
    match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html_text)
    if not match:
        raise ValueError('National Rail page has no retained __NEXT_DATA__ payload')
    payload = json.loads(html.unescape(match.group(1)))
    station = payload.get('props', {}).get('pageProps', {}).get('station', {})
    return station.get('name', ''), station.get('crsCode', '')


def collect(stations_path, evidence_id, out_dir, endpoint=ENDPOINT):
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    metadata_path = out_dir / 'capture-metadata.json'
    if metadata_path.exists():
        raise ValueError(f'Refusing to overwrite retained metadata: {metadata_path}')
    captures = []
    for station in read_rows(stations_path):
        if station['evidence_ids'] != evidence_id:
            continue
        response_path = out_dir / f"{station['location_id']}.html"
        if response_path.exists():
            raise ValueError(f'Refusing to overwrite retained capture: {response_path}')
        url, response = fetch(station['station_name'], endpoint)
        page_name, page_crs = page_station(response)
        if page_name != station['station_name'] or page_crs != station['station_crs']:
            raise ValueError(f"{station['location_id']}: page returned {page_name!r} ({page_crs}), "
                             f"expected {station['station_name']!r} ({station['station_crs']})")
        retrieved_at = datetime.now(LONDON).isoformat(timespec='seconds')
        captures.append((response_path, response, {'location_id': station['location_id'],
                        'station_name': page_name, 'station_crs': page_crs, 'request_url': url,
                        'response': response_path.name, 'retrieved_at_local': retrieved_at}))
    if not captures:
        raise ValueError(f'No station mappings found for evidence ID {evidence_id}')
    for response_path, response, _ in captures:
        response_path.write_text(response, encoding='utf-8')
    records = [record for _, _, record in captures]
    metadata = {
        'source_endpoint': endpoint,
        'records': records,
        'limitations': ('National Rail station pages verify station identity and CRS. Each mapping is a '
                        'representative broad-place origin, not a whole-place accessibility measurement.'),
    }
    metadata_path.write_text(json.dumps(metadata, indent=2) + '\n', encoding='utf-8')
    return metadata


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--stations', default='data/inputs/transport_stations.csv', type=Path)
    parser.add_argument('--evidence-id', required=True)
    parser.add_argument('--out-dir', required=True, type=Path)
    parser.add_argument('--endpoint', default=ENDPOINT)
    args = parser.parse_args()
    collect(args.stations, args.evidence_id, args.out_dir, args.endpoint)


if __name__ == '__main__':
    main()
