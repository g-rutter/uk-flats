#!/usr/bin/env python3
"""Retain National Rail Journey Planner JSON responses for reviewed routes.

This uses the public journey-planner service configured by National Rail's
website.  It does not update canonical inputs or choose a journey: those remain
review steps after the request and response have been retained and hashed.
"""
import argparse
import json
from datetime import datetime
from pathlib import Path
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo


ENDPOINT = 'https://jpservices.nationalrail.co.uk/journey-planner'
DEFAULT_SEARCH_TIMES = ('10:00', '11:00', '12:00', '13:00')
LONDON = ZoneInfo('Europe/London')


def local_timestamp(measurement_date, search_time):
    try:
        value = datetime.fromisoformat(f'{measurement_date}T{search_time}:00')
    except ValueError as error:
        raise ValueError('measurement date must be YYYY-MM-DD and search time HH:MM') from error
    if value.tzinfo is not None or not 0 <= value.hour <= 23 or not 0 <= value.minute <= 59:
        raise ValueError('measurement date must be YYYY-MM-DD and search time HH:MM')
    return value.replace(tzinfo=LONDON).isoformat(timespec='seconds')


def request_body(origin_crs, destination_crs, measurement_date, search_time,
                 origin_group=False, destination_group=False):
    """Build the public planner request without making a network call."""
    return {
        'origin': {'crs': origin_crs.upper(), 'group': origin_group},
        'destination': {'crs': destination_crs.upper(), 'group': destination_group},
        'outwardTime': {'travelTime': local_timestamp(measurement_date, search_time), 'type': 'DEPART'},
        'fareRequestDetails': {
            'passengers': {'adult': 1, 'child': 0}, 'fareClass': 'ANY', 'railcards': [],
        },
        'directTrains': False,
        'reducedTransferTime': False,
        'onlySearchForSleeper': False,
        'overtakenTrains': False,
        'useAlternativeServices': False,
        'increasedInterchange': 'ZERO',
    }


def fetch(body, endpoint=ENDPOINT):
    request = Request(
        endpoint, data=json.dumps(body, separators=(',', ':')).encode('utf-8'), method='POST',
        headers={'Accept': 'application/json', 'Content-Type': 'application/json',
                 'X-JP-Platform': 'DESKTOP'},
    )
    with urlopen(request, timeout=30) as response:
        return json.load(response)


def collect(out_dir, origin_crs, destination_crs, measurement_date, search_times,
            origin_group=False, destination_group=False, endpoint=ENDPOINT):
    """Write one immutable request/response pair per requested local search time."""
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    metadata_path = out_dir / 'capture-metadata.json'
    if metadata_path.exists():
        raise ValueError(f'Refusing to overwrite retained metadata: {metadata_path}')
    records = []
    for search_time in search_times:
        hour = search_time.split(':', 1)[0]
        request_path = out_dir / f'request-{hour}.json'
        response_path = out_dir / f'response-{hour}.json'
        if request_path.exists() or response_path.exists():
            raise ValueError(f'Refusing to overwrite retained capture for {search_time}')
        body = request_body(origin_crs, destination_crs, measurement_date, search_time,
                            origin_group, destination_group)
        response = fetch(body, endpoint)
        retrieved_at = datetime.now(LONDON).isoformat(timespec='seconds')
        request_path.write_text(json.dumps(body, indent=2) + '\n', encoding='utf-8')
        response_path.write_text(json.dumps(response, indent=2) + '\n', encoding='utf-8')
        records.append({'search_time_local': search_time, 'request': request_path.name,
                        'response': response_path.name, 'retrieved_at_local': retrieved_at,
                        'search_id': response.get('searchId', '')})
    metadata = {
        'source_endpoint': endpoint,
        'origin': {'crs': origin_crs.upper(), 'group': origin_group},
        'destination': {'crs': destination_crs.upper(), 'group': destination_group},
        'measurement_date': measurement_date,
        'searches': records,
        'limitations': ('Responses are dated planner snapshots. Review must exclude unsuitable non-rail '
                        'itineraries and select the shortest suitable itinerary within the stated window.'),
    }
    metadata_path.write_text(json.dumps(metadata, indent=2) + '\n', encoding='utf-8')
    return metadata


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out-dir', type=Path, required=True)
    parser.add_argument('--origin-crs', required=True)
    parser.add_argument('--destination-crs', required=True)
    parser.add_argument('--origin-group', action='store_true')
    parser.add_argument('--destination-group', action='store_true')
    parser.add_argument('--measurement-date', default='2026-09-11')
    parser.add_argument('--search-time', action='append', dest='search_times')
    parser.add_argument('--endpoint', default=ENDPOINT)
    args = parser.parse_args()
    collect(args.out_dir, args.origin_crs, args.destination_crs, args.measurement_date,
            tuple(args.search_times or DEFAULT_SEARCH_TIMES), args.origin_group,
            args.destination_group, args.endpoint)


if __name__ == '__main__':
    main()
