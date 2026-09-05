"""Summarise force-level offences outside named CSP rows for review."""
from collections import defaultdict

from crime import read
from extract_legacy import write_csv


def audit(observations):
    grouped = {}
    locations = defaultdict(set)
    for row in observations:
        key = row['force_code'], row['category']
        if key not in grouped:
            grouped[key] = row
        elif (grouped[key]['force_count'], grouped[key]['force_unallocated_count']) != (
                row['force_count'], row['force_unallocated_count']):
            raise ValueError('Inconsistent force residual across CSP observations')
        locations[key].add(row['location_id'])
    rows = []
    for (force_code, category), row in sorted(grouped.items()):
        force_count = row['force_count']
        residual = row['force_unallocated_count']
        percent = '' if not force_count or residual == '' else f'{int(residual) / int(force_count) * 100:.3f}'
        status = '' if percent == '' else ('Material; investigate before comparison' if float(percent) >= 5 else 'Below 5%; retain for review')
        rows.append(dict(force_code=force_code, force_name=row['force_name'], category=category,
                         period_start=row['period_start'], period_end=row['period_end'],
                         force_count=force_count, unallocated_count=residual,
                         unallocated_percent=percent, material_threshold_percent='5.000',
                         review_status=status, represented_locations=' | '.join(sorted(locations[(force_code, category)])),
                         evidence_id=row['evidence_id'], source_url=row['source_url'],
                         retrieval_date=row['retrieval_date'], source_sha256=row['source_sha256'],
                         source_cells='Force total and named CSP rows in ' + row['source_cells'].split('; ')[0].split('!')[0]))
    return rows


def export_residuals(root):
    write_csv(root / 'data/derived/crime_residual_audit.csv',
              audit(read(root / 'data/inputs/crime_observations.csv')))
