#!/usr/bin/env python3
"""Combine separately verified National Rail review-staging files by location."""
import argparse
import csv
from pathlib import Path
from csv_io import write_csv


FIELDS = ('location_id', 'londonMinutes', 'londonChanges', 'birminghamMinutes',
          'birminghamChanges', 'confidence', 'reason')


def read_rows(path):
    with Path(path).open(newline='', encoding='utf-8') as source:
        reader = csv.DictReader(source)
        if not reader.fieldnames or set(FIELDS) - set(reader.fieldnames):
            raise ValueError(f'{path}: missing National Rail staging columns')
        rows = list(reader)
    if any(None in row or None in row.values() or not row['location_id'] for row in rows):
        raise ValueError(f'{path}: malformed National Rail staging rows')
    return rows


def combine(paths, locations_path):
    merged = {}
    for path in paths:
        for row in read_rows(path):
            if row['location_id'] in merged:
                raise ValueError(f'Duplicate staged location: {row["location_id"]}')
            merged[row['location_id']] = {field: row[field] for field in FIELDS}
    with Path(locations_path).open(newline='', encoding='utf-8') as source:
        location_ids = [row['id'] for row in csv.DictReader(source)]
    if set(merged) != set(location_ids):
        missing, extra = set(location_ids) - set(merged), set(merged) - set(location_ids)
        raise ValueError('Staging does not cover exactly the screen: missing ' +
                         ', '.join(sorted(missing)) + '; extra ' + ', '.join(sorted(extra)))
    return [merged[location_id] for location_id in location_ids]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', action='append', required=True, type=Path)
    parser.add_argument('--locations', default='data/inputs/locations.csv', type=Path)
    parser.add_argument('--out', required=True, type=Path)
    args = parser.parse_args()
    if args.out.exists():
        raise ValueError(f'{args.out}: refusing to replace review staging')
    rows = combine(args.input, args.locations)
    write_csv(args.out, rows, FIELDS)


if __name__ == '__main__':
    main()
