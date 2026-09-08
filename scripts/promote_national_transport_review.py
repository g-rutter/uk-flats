#!/usr/bin/env python3
"""Promote an explicitly accepted National Rail review table to canonical input."""
import argparse
import csv
from pathlib import Path


FIELDS = ('location_id', 'londonMinutes', 'londonChanges', 'birminghamMinutes',
          'birminghamChanges', 'confidence', 'reason')
REASON = ('Reviewed National Rail Journey Planner station-to-station observation for '
          '2026-09-11. Shortest returned public-transport itinerary departing 10:00–14:00; '
          'not a guaranteed, door-to-door, fare or accessibility measure.')


def promote(review_path, locations_path):
    with Path(review_path).open(newline='', encoding='utf-8') as source:
        review = {row['location_id']: row for row in csv.DictReader(source)}
    with Path(locations_path).open(newline='', encoding='utf-8') as source:
        locations = list(csv.DictReader(source))
    if set(review) != {row['id'] for row in locations}:
        raise ValueError('Review table must cover exactly the current screen')
    return [{
        'location_id': location['id'],
        'londonMinutes': review[location['id']]['londonMinutes'],
        'londonChanges': review[location['id']]['londonChanges'],
        'birminghamMinutes': review[location['id']]['birminghamMinutes'],
        'birminghamChanges': review[location['id']]['birminghamChanges'],
        'confidence': review[location['id']]['confidence'],
        'reason': REASON,
    } for location in locations]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--review', required=True, type=Path)
    parser.add_argument('--locations', default='data/inputs/locations.csv', type=Path)
    parser.add_argument('--out', default='data/inputs/nationalTransport.csv', type=Path)
    parser.add_argument('--accept', action='store_true', help='Required to replace canonical input')
    args = parser.parse_args()
    if not args.accept:
        raise ValueError('Pass --accept only after review approval')
    rows = promote(args.review, args.locations)
    with args.out.open('w', newline='', encoding='utf-8') as target:
        writer = csv.DictWriter(target, fieldnames=FIELDS, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)


if __name__ == '__main__':
    main()
