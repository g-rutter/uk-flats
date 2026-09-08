#!/usr/bin/env python3
"""Extract official crime observations into canonical CSVs, offline.

Pinned to the inspected YE March 2026 workbook layout. Fail on changed headers,
periods, hashes or geography. build.py calculates rates separately.
"""
import argparse
import csv
import hashlib
from pathlib import Path

from crime_workbook import sheets
from csv_io import write_csv

ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / 'data/raw/crime/2026-09-05'


def read_csv(path):
    with path.open(newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))


def number(value):
    if value in ('', '[x]', '[u]', '[u1]'):
        return ''
    result = int(value)
    if result < 0:
        raise ValueError('Negative source count requires review, not conversion to zero')
    return result


def prepare(snapshot, inputs):
    manifest = {r['file']: r for r in read_csv(snapshot / 'manifest.csv')}
    for name, metadata in manifest.items():
        if hashlib.sha256((snapshot / name).read_bytes()).hexdigest() != metadata['sha256']:
            raise ValueError(f'Source hash mismatch: {name}')
    workbook = dict(sheets(snapshot / 'pfa.xlsx'))
    c2, c4 = workbook['Table C2'], workbook['Table C4']
    for table in (c2, c4):
        if 'year ending March 2026' not in table[0]['A']:
            raise ValueError('Unexpected crime period')
    for table, col, label in [(c2, 'H', 'Violence against the person'),
                              (c2, 'N', 'Sexual offences'),
                              (c4, 'J', 'Violence against the person'),
                              (c4, 'P', 'Sexual offences')]:
        if table[7][col] != label:
            raise ValueError('Changed source layout')
    if 'mid-2024' not in c4[7]['G'] or 'rounded to 100' not in c4[7]['G']:
        raise ValueError('Changed population basis')
    def index(table):
        result = {}
        for i, row in enumerate(table, 1):
            code = row.get('C', '')
            if code.startswith(('E22', 'W14')):
                if code in result:
                    raise ValueError(f'Duplicate CSP {code}')
                result[code] = (i, row)
        return result
    counts, populations = index(c2), index(c4)
    rows = []
    for mapping in read_csv(inputs / 'crime_geographies.csv'):
        code = mapping['csp_code']
        ni, numerator = counts[code]
        pi, population = populations[code]
        if numerator['D'] != mapping['csp_name'] or any(numerator[k] != population[k] for k in 'ABCDEF'):
            raise ValueError(f'Geography mismatch for {code}')
        for category, col, rate_col in [('violence_against_person', 'H', 'J'), ('sexual_offences', 'N', 'P')]:
            force = next(r for r in c2 if r.get('A') == numerator['A'] and not r.get('C') and not r.get('D'))
            assigned = [r for r in c2 if r.get('A') == numerator['A'] and r.get('C', '').startswith(('E22', 'W14'))]
            force_count = number(force[col])
            assigned_counts = [number(r[col]) for r in assigned]
            unallocated = force_count - sum(assigned_counts) if force_count != '' and '' not in assigned_counts else ''
            rows.append(dict(location_id=mapping['location_id'], category=category,
                csp_code=code, csp_name=mapping['csp_name'], force_code=numerator['A'], force_name=numerator['B'],
                period_start='2025-04-01', period_end='2026-03-31',
                count=number(numerator[col]), population=number(population['G']),
                population_period='mid-2024', population_rounding='nearest 100',
                published_rate_per_1000=population[rate_col] if number_or_missing(population[rate_col]) else '',
                force_count=force_count, force_unallocated_count=unallocated,
                coverage='Published annual CSP total; monthly completeness not independently verified',
                evidence_id='CRIME-ONS-2026-CSP', source_url=manifest['pfa.xlsx']['url'],
                retrieval_date=manifest['pfa.xlsx']['retrieved_at'],
                source_cells=f'Table C2!{col}{ni}; Table C4!G{pi}; Table C4!{rate_col}{pi}',
                source_sha256=manifest['pfa.xlsx']['sha256']))
    write_csv(inputs / 'crime_observations.csv', rows)


def number_or_missing(value):
    if value in ('', '[x]', '[u]', '[u1]'):
        return False
    return float(value) >= 0


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--snapshot', type=Path, default=SNAPSHOT)
    parser.add_argument('--inputs', type=Path, default=ROOT / 'data/inputs')
    args = parser.parse_args()
    prepare(args.snapshot, args.inputs)
