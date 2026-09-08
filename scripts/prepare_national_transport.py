#!/usr/bin/env python3
"""Validate manually transcribed National Rail observations; never query the planner."""
import argparse
import csv
from datetime import datetime
from pathlib import Path

from release_manifest import load as load_manifest

STATION_COLUMNS = ('location_id', 'station_crs', 'station_name', 'selection_reason',
                   'confidence', 'evidence_ids')
ROUTE_COLUMNS = (
    'location_id', 'destination_id', 'origin_crs', 'destination_crs', 'measurement_date',
    'selection_window_start_local', 'selection_window_end_local', 'planner_search_times',
    'query_timestamp_local', 'selected_departure_local', 'selected_arrival_local',
    'elapsed_minutes', 'changes', 'frequency_window_start_local',
    'frequency_window_end_local', 'usable_departures_in_window', 'source_url',
    'raw_capture_path', 'retrieval_timestamp', 'confidence', 'evidence_id', 'reason')
DESTINATIONS = {'london', 'birmingham'}


def read_csv(path, columns):
    with Path(path).open(newline='', encoding='utf-8') as source:
        reader = csv.DictReader(source)
        if not reader.fieldnames or set(columns) - set(reader.fieldnames):
            raise ValueError(f'{path}: missing required columns')
        rows = list(reader)
    if any(None in row or None in row.values() for row in rows):
        raise ValueError(f'{path}: malformed CSV row')
    return rows


def parse_timestamp(value, field):
    try:
        result = datetime.fromisoformat(value)
    except ValueError as error:
        raise ValueError(f'{field}: invalid ISO local timestamp {value!r}') from error
    if result.tzinfo is None:
        raise ValueError(f'{field}: timezone offset is required')
    return result


def parse_integer(value, field):
    try:
        result = int(value)
    except ValueError as error:
        raise ValueError(f'{field}: expected a whole number') from error
    if result < 0 or str(result) != value:
        raise ValueError(f'{field}: expected a non-negative whole number')
    return result


def write_csv(path, rows, fieldnames):
    with Path(path).open('w', newline='', encoding='utf-8') as target:
        writer = csv.DictWriter(target, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def worst_confidence(*values):
    values = [value for value in values if value]
    return min(values, key=('Low', 'Medium', 'High').index) if values else ''


def prepare(release_dir, stations_path, observations_path, out_dir, measurement_date):
    manifest = load_manifest(release_dir)
    station_by_location = {}
    for row in read_csv(stations_path, STATION_COLUMNS):
        if not row['location_id'] or row['location_id'] in station_by_location:
            raise ValueError('Station mappings need unique non-blank location_id values')
        if not all(row[column] for column in STATION_COLUMNS[1:]):
            raise ValueError(f'{row["location_id"]}: reviewed station mapping has blank fields')
        if row['confidence'] not in ('High', 'Medium', 'Low'):
            raise ValueError(f'{row["location_id"]}: invalid station confidence')
        station_by_location[row['location_id']] = row

    reviewed, observations, seen = [], [], set()
    for row in read_csv(observations_path, ROUTE_COLUMNS):
        key = (row['location_id'], row['destination_id'])
        if not all(key) or key in seen:
            raise ValueError('Route observations need unique non-blank location/destination keys')
        seen.add(key)
        if row['destination_id'] not in DESTINATIONS:
            raise ValueError(f'{key}: destination_id must be london or birmingham')
        station = station_by_location.get(row['location_id'])
        if not station or row['origin_crs'] != station['station_crs']:
            raise ValueError(f'{key}: origin_crs needs a matching reviewed station mapping')
        if row['measurement_date'] != measurement_date or not row['reason']:
            raise ValueError(f'{key}: wrong measurement date or blank reason')
        itinerary = ('selected_departure_local', 'selected_arrival_local', 'elapsed_minutes', 'changes')
        populated = [bool(row[column]) for column in itinerary]
        if any(populated) and not all(populated):
            raise ValueError(f'{key}: selected itinerary fields must be complete or all blank')
        observations.append(row)
        if not all(populated):
            if any(row[column] for column in ('source_url', 'raw_capture_path', 'confidence', 'evidence_id')):
                raise ValueError(f'{key}: unavailable route has itinerary-only evidence fields')
            continue
        required = ('destination_crs', 'selection_window_start_local', 'selection_window_end_local',
                    'planner_search_times', 'query_timestamp_local', 'source_url', 'raw_capture_path',
                    'retrieval_timestamp', 'confidence', 'evidence_id')
        if any(not row[column] for column in required):
            raise ValueError(f'{key}: selected route has blank provenance fields')
        if row['confidence'] not in ('High', 'Medium', 'Low') or not row['source_url'].startswith(('https://', 'http://')):
            raise ValueError(f'{key}: invalid confidence or source URL')
        if row['raw_capture_path'] not in manifest:
            raise ValueError(f'{key}: capture is absent from the retained release manifest')
        departure = parse_timestamp(row['selected_departure_local'], f'{key} departure')
        arrival = parse_timestamp(row['selected_arrival_local'], f'{key} arrival')
        window_start = parse_timestamp(row['selection_window_start_local'], f'{key} window start')
        window_end = parse_timestamp(row['selection_window_end_local'], f'{key} window end')
        parse_timestamp(row['query_timestamp_local'], f'{key} query')
        parse_timestamp(row['retrieval_timestamp'], f'{key} retrieval')
        elapsed = parse_integer(row['elapsed_minutes'], f'{key} elapsed_minutes')
        parse_integer(row['changes'], f'{key} changes')
        if departure.date().isoformat() != measurement_date or not window_start <= departure <= window_end:
            raise ValueError(f'{key}: selected departure is outside the documented window')
        if round((arrival - departure).total_seconds() / 60) != elapsed:
            raise ValueError(f'{key}: elapsed_minutes disagrees with selected timestamps')
        if row['usable_departures_in_window']:
            parse_integer(row['usable_departures_in_window'], f'{key} usable departures')
            parse_timestamp(row['frequency_window_start_local'], f'{key} frequency window start')
            parse_timestamp(row['frequency_window_end_local'], f'{key} frequency window end')
        elif row['frequency_window_start_local'] or row['frequency_window_end_local']:
            raise ValueError(f'{key}: frequency window requires a departure count')
        reviewed.append(row)

    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    write_csv(out_dir / 'national_transport_route_review.csv', reviewed, ROUTE_COLUMNS)
    pivot = []
    for location in sorted({row['location_id'] for row in observations}):
        routes = {row['destination_id']: row for row in reviewed if row['location_id'] == location}
        london, birmingham = routes.get('london', {}), routes.get('birmingham', {})
        pivot.append({'location_id': location, 'londonMinutes': london.get('elapsed_minutes', ''),
                      'londonChanges': london.get('changes', ''),
                      'birminghamMinutes': birmingham.get('elapsed_minutes', ''),
                      'birminghamChanges': birmingham.get('changes', ''),
                      'confidence': worst_confidence(london.get('confidence'), birmingham.get('confidence')),
                      'reason': 'Review-staged National Rail observations; not canonical until approved.'})
    write_csv(out_dir / 'national_transport_staging.csv', pivot,
              ('location_id', 'londonMinutes', 'londonChanges', 'birminghamMinutes',
               'birminghamChanges', 'confidence', 'reason'))
    return reviewed, pivot


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', type=Path, required=True)
    parser.add_argument('--stations', type=Path, required=True)
    parser.add_argument('--observations', type=Path, required=True)
    parser.add_argument('--out-dir', type=Path, required=True)
    parser.add_argument('--measurement-date', default='2026-09-11')
    args = parser.parse_args()
    prepare(args.release, args.stations, args.observations, args.out_dir, args.measurement_date)


if __name__ == '__main__':
    main()
