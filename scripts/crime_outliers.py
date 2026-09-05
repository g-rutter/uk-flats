"""List extreme research rates for contextual review.

This is a QA aid only. It does not classify locations as safe or unsafe and
never feeds the browser or a ranking.
"""
from decimal import Decimal

from crime import read
from extract_legacy import write_csv


def audit(observations, extremes=3):
    by_category = {}
    for row in observations:
        if row['category'] not in ('violence_against_person', 'sexual_offences'):
            continue
        if not row['count'] or not row['population']:
            continue
        enriched = dict(row)
        enriched['rate_per_1000'] = f'{Decimal(row["count"]) / Decimal(row["population"]) * 1000:.3f}'
        by_category.setdefault(row['category'], []).append(enriched)

    result = []
    for category, rows in sorted(by_category.items()):
        ordered = sorted(rows, key=lambda r: (Decimal(r['rate_per_1000']), r['location_id']))
        selected = [(r, 'lowest', i + 1) for i, r in enumerate(ordered[:extremes])]
        selected += [(r, 'highest', i + 1) for i, r in enumerate(reversed(ordered[-extremes:]))]
        seen = set()
        for row, direction, rank in selected:
            key = row['location_id'], category
            if key in seen:
                continue
            seen.add(key)
            result.append(dict(
                location_id=row['location_id'], category=category,
                direction=direction, rank=str(rank), rate_per_1000=row['rate_per_1000'],
                count=row['count'], population=row['population'],
                csp_code=row['csp_code'], csp_name=row['csp_name'],
                force_code=row['force_code'], force_name=row['force_name'],
                force_unallocated_percent=(
                    '' if not row['force_count'] or not row['force_unallocated_count'] else
                    f'{Decimal(row["force_unallocated_count"]) / Decimal(row["force_count"]) * 100:.3f}'),
                period_start=row['period_start'], period_end=row['period_end'],
                evidence_id=row['evidence_id'], source_url=row['source_url'],
                retrieval_date=row['retrieval_date'], source_sha256=row['source_sha256'],
                source_cells=row['source_cells'],
                review_status='Contextual review required; no safety interpretation',
                review_reason='Extreme rate among available CSP research rows; check geography, coverage, population and recording context',
            ))
    return result


def export_outliers(root):
    write_csv(root / 'data/derived/crime_outlier_audit.csv',
              audit(read(root / 'data/inputs/crime_observations.csv')))
