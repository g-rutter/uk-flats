#!/usr/bin/env python3
"""Compare review-staged National Rail values with imported canonical values."""
import argparse
import csv
from pathlib import Path


FIELDS = ('location_id', 'location_name', 'review_london_minutes', 'imported_london_minutes',
          'london_minutes_difference', 'review_london_changes', 'imported_london_changes',
          'london_changes_difference', 'review_birmingham_minutes', 'imported_birmingham_minutes',
          'birmingham_minutes_difference', 'review_birmingham_changes',
          'imported_birmingham_changes', 'birmingham_changes_difference', 'review_confidence')


def rows(locations_path, imported_path, review_path):
    def read(path):
        with Path(path).open(newline='', encoding='utf-8') as source:
            return list(csv.DictReader(source))
    imported = {row['location_id']: row for row in read(imported_path)}
    review = {row['location_id']: row for row in read(review_path)}
    result = []
    for location in read(locations_path):
        ident = location['id']
        if ident not in review:
            raise ValueError(f'{ident}: missing review transport row')
        old, new = imported.get(ident, {}), review[ident]
        row = {'location_id': ident, 'location_name': location['name'], 'review_confidence': new['confidence']}
        for gateway, prefix in (('london', 'london'), ('birmingham', 'birmingham')):
            for measure, suffix in (('Minutes', 'minutes'), ('Changes', 'changes')):
                reviewed, prior = new[gateway + measure], old.get(gateway + measure, '')
                row[f'review_{prefix}_{suffix}'] = reviewed
                row[f'imported_{prefix}_{suffix}'] = prior
                row[f'{prefix}_{suffix}_difference'] = str(int(reviewed) - int(prior)) if reviewed and prior else ''
        result.append(row)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--locations', default='data/inputs/locations.csv', type=Path)
    parser.add_argument('--imported', default='data/inputs/nationalTransport.csv', type=Path)
    parser.add_argument('--review', required=True, type=Path)
    parser.add_argument('--out', required=True, type=Path)
    args = parser.parse_args()
    if args.out.exists():
        raise ValueError(f'{args.out}: refusing to replace comparison output')
    with args.out.open('w', newline='', encoding='utf-8') as target:
        writer = csv.DictWriter(target, fieldnames=FIELDS, lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows(args.locations, args.imported, args.review))


if __name__ == '__main__':
    main()
