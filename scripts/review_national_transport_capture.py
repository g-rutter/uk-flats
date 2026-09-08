#!/usr/bin/env python3
"""Stage reviewed National Rail Journey Planner observations from a hashed raw release."""
import argparse
import csv
import json
from datetime import datetime
from pathlib import Path

from prepare_national_transport import ROUTE_COLUMNS
from release_manifest import load as load_manifest


WINDOW_START = '2026-09-11T10:00:00+01:00'
WINDOW_END = '2026-09-11T14:00:00+01:00'
SEARCH_TIMES = '10:00;11:00;12:00;13:00'
SOURCE_URL = 'https://jpservices.nationalrail.co.uk/journey-planner'
EVIDENCE_ID = 'TR-NATIONAL-20260908-DIRECT-PILOT'
REVIEW_REASON = ('Reviewed retained direct responses. Shortest elapsed National Rail Journey Planner '
                 'itinerary departing in the documented window; changes count equals itinerary legs minus one.')


def read_json(path):
    with Path(path).open(encoding='utf-8') as source:
        return json.load(source)


def route_candidates(route_dir):
    metadata = read_json(route_dir / 'capture-metadata.json')
    retrievals = {item['response']: item['retrieved_at_local'] for item in metadata['searches']}
    candidates = {}
    for response_path in sorted(route_dir.glob('response-*.json')):
        for journey in read_json(response_path).get('outwardJourneys', []):
            legs = journey.get('legs', [])
            timetable = journey.get('timetable', {}).get('scheduled', {})
            departure, arrival = timetable.get('departure'), timetable.get('arrival')
            if not (departure and arrival and legs and WINDOW_START <= departure <= WINDOW_END):
                continue
            elapsed = round((datetime.fromisoformat(arrival) - datetime.fromisoformat(departure)).total_seconds() / 60)
            candidates[(elapsed, departure, arrival, len(legs) - 1)] = response_path.name
    return metadata, candidates, retrievals


def review(release_dir, stations_path, evidence_id=EVIDENCE_ID, include_self_route=True):
    release_dir = Path(release_dir)
    load_manifest(release_dir)
    with Path(stations_path).open(newline='', encoding='utf-8') as source:
        station_ids = {row['station_crs']: row['location_id'] for row in csv.DictReader(source)}
    rows = []
    for route_dir in sorted((release_dir / 'transport').iterdir()):
        metadata, candidates, retrievals = route_candidates(route_dir)
        origin, destination = metadata['origin']['crs'], metadata['destination']['crs']
        location_id = station_ids[origin]
        destination_id = 'london' if metadata['destination']['group'] else 'birmingham'
        row = dict.fromkeys(ROUTE_COLUMNS, '')
        row.update(location_id=location_id, destination_id=destination_id, origin_crs=origin,
                   measurement_date=metadata['measurement_date'])
        if not candidates:
            row['reason'] = ('No National Rail Journey Planner itinerary departing in the documented window '
                             'was present in the retained direct responses; left unavailable rather than zero.')
            rows.append(row)
            continue
        (elapsed, departure, arrival, changes), response_name = min(candidates.items())
        row.update(destination_crs=destination, selection_window_start_local=WINDOW_START,
                   selection_window_end_local=WINDOW_END, planner_search_times=SEARCH_TIMES,
                   query_timestamp_local=retrievals[response_name], selected_departure_local=departure,
                   selected_arrival_local=arrival, elapsed_minutes=str(elapsed), changes=str(changes),
                   source_url=SOURCE_URL,
                   raw_capture_path=(route_dir / response_name).relative_to(release_dir).as_posix(),
                   retrieval_timestamp=retrievals[response_name], confidence='Medium',
                   evidence_id=evidence_id, reason=REVIEW_REASON)
        rows.append(row)
    if include_self_route and 'BHM' in station_ids:
        row = dict.fromkeys(ROUTE_COLUMNS, '')
        row.update(location_id=station_ids['BHM'], destination_id='birmingham', origin_crs='BHM',
                   destination_crs='BHM', measurement_date=rows[0]['measurement_date'],
                   elapsed_minutes='0', changes='0', confidence='High', evidence_id=evidence_id,
                   reason='Birmingham New Street is the fixed Birmingham gateway; same-station self-route is zero minutes and zero changes.')
        rows.append(row)
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', type=Path, required=True)
    parser.add_argument('--stations', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--evidence-id', default=EVIDENCE_ID)
    parser.add_argument('--no-self-route', action='store_true',
                        help='Use when the Birmingham self-route is retained in another reviewed release')
    parser.add_argument('--overwrite', action='store_true')
    args = parser.parse_args()
    if args.out.exists() and not args.overwrite:
        raise ValueError(f'{args.out} already exists; refusing to replace reviewed observations')
    rows = review(args.release, args.stations, args.evidence_id, not args.no_self_route)
    with args.out.open('w', newline='', encoding='utf-8') as target:
        writer = csv.DictWriter(target, fieldnames=ROUTE_COLUMNS, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)


if __name__ == '__main__':
    main()
