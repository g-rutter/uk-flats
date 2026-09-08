#!/usr/bin/env python3
"""Create a resumable, review-first National Rail direct-collection queue.

This script never contacts the Journey Planner.  It only makes the work list
which the direct JSON collector carries out after station-mapping review.
"""
import argparse
import csv
from pathlib import Path


DESTINATIONS = (
    ('london', 'London (All Stations)', '182'),
    ('birmingham', 'Birmingham New Street', 'BHM'),
)
SEARCH_TIMES = '10:00;11:00;12:00;13:00'
FIELDS = (
    'location_id', 'location_name', 'origin_crs', 'origin_station_name',
    'destination_id', 'destination_name', 'destination_planner_id',
    'measurement_date', 'window_start_local', 'window_end_local',
    'search_times_local', 'status', 'reason',
)


def read_rows(path):
    with Path(path).open(newline='', encoding='utf-8') as source:
        return list(csv.DictReader(source))


def excluded_route_keys(path, measurement_date):
    if path is None:
        return set()
    rows = read_rows(path)
    required = {'location_id', 'destination_id', 'measurement_date'}
    if not rows or required - set(rows[0]):
        raise ValueError(f'{path}: route observations need location, destination and measurement-date columns')
    keys = {(row['location_id'], row['destination_id']) for row in rows
            if row['measurement_date'] == measurement_date}
    if len(keys) != sum(row['measurement_date'] == measurement_date for row in rows):
        raise ValueError(f'{path}: duplicate route observation keys for {measurement_date}')
    return keys


def create_queue(locations_path, stations_path, measurement_date, location_ids=None,
                 exclude_observations=None):
    locations = read_rows(locations_path)
    stations = {row['location_id']: row for row in read_rows(stations_path)}
    wanted = set(location_ids or ())
    if wanted:
        unknown = wanted - {row['id'] for row in locations}
        if unknown:
            raise ValueError(f'Unknown location ids: {", ".join(sorted(unknown))}')
        locations = [row for row in locations if row['id'] in wanted]
    excluded = excluded_route_keys(exclude_observations, measurement_date)
    rows = []
    for location in locations:
        station = stations.get(location['id'], {})
        for destination_id, destination_name, destination_planner_id in DESTINATIONS:
            if (location['id'], destination_id) in excluded:
                continue
            same_station = station.get('station_crs') == destination_planner_id
            if not station:
                status, reason = 'blocked-mapping', 'Reviewed origin-station mapping is required before collection.'
            elif same_station:
                status, reason = 'degenerate-zero', 'Origin equals the fixed Birmingham New Street endpoint; record a zero-minute, zero-change self-route without collection.'
            else:
                status, reason = 'pending', 'Use the direct Journey Planner collector; transcribe only values supported by retained JSON after review.'
            rows.append({
                'location_id': location['id'], 'location_name': location['name'],
                'origin_crs': station.get('station_crs', ''),
                'origin_station_name': station.get('station_name', ''),
                'destination_id': destination_id, 'destination_name': destination_name,
                'destination_planner_id': destination_planner_id,
                'measurement_date': measurement_date,
                'window_start_local': f'{measurement_date}T10:00:00+01:00',
                'window_end_local': f'{measurement_date}T14:00:00+01:00',
                'search_times_local': SEARCH_TIMES, 'status': status, 'reason': reason,
            })
    return rows


def write_queue(path, rows, overwrite=False):
    path = Path(path)
    if path.exists() and not overwrite:
        raise ValueError(f'{path} already exists; use --overwrite only after retaining the prior queue.')
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w', newline='', encoding='utf-8') as target:
        writer = csv.DictWriter(target, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--locations', default='data/inputs/locations.csv', type=Path)
    parser.add_argument('--stations', default='data/inputs/transport_stations.csv', type=Path)
    parser.add_argument('--measurement-date', default='2026-09-11')
    parser.add_argument('--location-id', action='append', dest='location_ids')
    parser.add_argument('--exclude-observations', type=Path,
                        help='Retained same-date reviewed routes to leave out of a supplement queue')
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--overwrite', action='store_true')
    args = parser.parse_args()
    rows = create_queue(args.locations, args.stations, args.measurement_date, args.location_ids,
                        args.exclude_observations)
    write_queue(args.out, rows, args.overwrite)


if __name__ == '__main__':
    main()
