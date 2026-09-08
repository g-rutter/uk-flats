#!/usr/bin/env python3
"""Run a complete, immutable National Rail collection queue sequentially.

The queue is generated offline. This wrapper makes no selection of journeys and
never resumes an interrupted release: a release is eligible for manifesting
only when every pending route has a complete direct-collector metadata file.
"""
import argparse
import csv
import json
from pathlib import Path

from collect_national_transport_http import DEFAULT_SEARCH_TIMES, collect


REQUIRED_COLUMNS = (
    'location_id', 'origin_crs', 'destination_id', 'destination_planner_id',
    'measurement_date', 'search_times_local', 'status',
)


def read_queue(path):
    with Path(path).open(newline='', encoding='utf-8') as source:
        reader = csv.DictReader(source)
        if not reader.fieldnames or set(REQUIRED_COLUMNS) - set(reader.fieldnames):
            raise ValueError(f'{path}: missing required queue columns')
        rows = list(reader)
    if not rows or any(None in row or None in row.values() for row in rows):
        raise ValueError(f'{path}: empty or malformed collection queue')
    return rows


def verify_completed_route(route_dir, row):
    """Verify enough immutable route structure to make a safe resume decision."""
    metadata_path = route_dir / 'capture-metadata.json'
    if not metadata_path.is_file():
        raise ValueError(f'{route_dir}: incomplete route capture cannot be resumed')
    with metadata_path.open(encoding='utf-8') as source:
        metadata = json.load(source)
    if (metadata.get('origin', {}).get('crs') != row['origin_crs'] or
            metadata.get('destination', {}).get('crs') != row['destination_planner_id'] or
            metadata.get('destination', {}).get('group') != (row['destination_id'] == 'london') or
            metadata.get('measurement_date') != row['measurement_date']):
        raise ValueError(f'{route_dir}: retained metadata does not match its queue route')
    searches = metadata.get('searches', [])
    times = tuple(search.get('search_time_local') for search in searches)
    if times != DEFAULT_SEARCH_TIMES:
        raise ValueError(f'{route_dir}: retained metadata has incomplete search times')
    expected = {'capture-metadata.json'}
    for search in searches:
        expected.update((search.get('request'), search.get('response')))
    if None in expected or {path.name for path in route_dir.iterdir() if path.is_file()} != expected:
        raise ValueError(f'{route_dir}: retained capture files are incomplete or unexpected')


def collect_queue(queue_path, release_dir):
    """Collect every pending queue row, safely resuming complete route bundles."""
    rows = read_queue(queue_path)
    blocked = [row for row in rows if row['status'] == 'blocked-mapping']
    unexpected = [row for row in rows if row['status'] not in ('pending', 'degenerate-zero', 'blocked-mapping')]
    if blocked or unexpected:
        details = blocked + unexpected
        raise ValueError('Queue contains non-collectable rows: ' + ', '.join(
            f"{row['location_id']}__{row['destination_id']} ({row['status']})" for row in details))
    pending = [row for row in rows if row['status'] == 'pending']
    if not pending:
        raise ValueError('Queue has no pending routes')
    keys = [(row['location_id'], row['destination_id']) for row in pending]
    if len(keys) != len(set(keys)):
        raise ValueError('Queue has duplicate pending location/destination routes')
    release_dir = Path(release_dir)
    transport_dir = release_dir / 'transport'
    expected_names = {f"{row['location_id']}__{row['destination_id']}" for row in pending}
    if transport_dir.exists():
        found_names = {path.name for path in transport_dir.iterdir() if path.is_dir()}
        unexpected_names = found_names - expected_names
        if unexpected_names:
            raise ValueError('Release has unexpected retained route directories: ' +
                             ', '.join(sorted(unexpected_names)))
    collected = []
    for row in pending:
        search_times = tuple(row['search_times_local'].split(';'))
        if search_times != DEFAULT_SEARCH_TIMES:
            raise ValueError(f"{row['location_id']}__{row['destination_id']}: unexpected search times")
        route_dir = transport_dir / f"{row['location_id']}__{row['destination_id']}"
        if route_dir.exists():
            verify_completed_route(route_dir, row)
            collected.append(route_dir)
            continue
        collect(route_dir, row['origin_crs'], row['destination_planner_id'],
                row['measurement_date'], search_times,
                destination_group=row['destination_id'] == 'london')
        collected.append(route_dir)
    return collected


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--queue', type=Path, required=True)
    parser.add_argument('--release', type=Path, required=True)
    args = parser.parse_args()
    collected = collect_queue(args.queue, args.release)
    print(f'Verified or collected {len(collected)} National Rail routes.')


if __name__ == '__main__':
    main()
