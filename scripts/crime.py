"""Validate research-only crime evidence and calculate population rates."""
import csv
from datetime import date
from decimal import Decimal, InvalidOperation
import hashlib
import re

from crime_workbook import sheets
from extract_legacy import write_csv

CATEGORIES = ('violence_against_person', 'sexual_offences', 'asb')


def read(path):
    with path.open(newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames or len(reader.fieldnames) != len(set(reader.fieldnames)):
            raise ValueError(f'Invalid columns: {path}')
        rows = list(reader)
    if any(None in r or None in r.values() for r in rows):
        raise ValueError(f'Malformed CSV: {path}')
    return rows


def numeric(value, whole=False):
    if value == '':
        return None
    try:
        result = Decimal(value)
    except InvalidOperation as exc:
        raise ValueError('Invalid crime number') from exc
    if not result.is_finite() or result < 0 or (whole and result != result.to_integral_value()):
        raise ValueError('Invalid crime number')
    return result


def compile_crime(inputs, locations, evidence):
    identities = {r['id'] for r in locations}
    evidence_ids = {r['id'] for r in evidence}
    mappings = {}
    for row in read(inputs / 'crime_geographies.csv'):
        ident = row['location_id']
        if ident not in identities or ident in mappings:
            raise ValueError('Orphan or duplicate crime geography')
        if not re.fullmatch(r'(E22|W14)\d{6}', row['csp_code']):
            raise ValueError('Invalid CSP code')
        if not row['csp_name'] or not row['mapping_reason'] or not row['boundary_basis']:
            raise ValueError('Crime geography needs provenance')
        mappings[ident] = row
    observations = {}
    for row in read(inputs / 'crime_observations.csv'):
        ident, category = row['location_id'], row['category']
        key = ident, category
        if ident not in mappings or category not in CATEGORIES or key in observations:
            raise ValueError('Orphan, duplicate or invalid crime observation')
        if row['csp_code'] != mappings[ident]['csp_code'] or row['csp_name'] != mappings[ident]['csp_name']:
            raise ValueError('Crime numerator/population geography mismatch')
        if row['evidence_id'] not in evidence_ids:
            raise ValueError('Unknown crime evidence id')
        if not row['source_url'].startswith('https://') or not re.fullmatch('[a-f0-9]{64}', row['source_sha256']):
            raise ValueError('Missing crime source provenance')
        date.fromisoformat(row['retrieval_date'][:10])
        # Support one explicit release/window until a new source is reviewed.
        if (row['period_start'], row['period_end'], row['population_period'], row['population_rounding']) != (
                '2025-04-01', '2026-03-31', 'mid-2024', 'nearest 100'):
            raise ValueError('Unreviewed crime period or population basis')
        count = numeric(row['count'], whole=True)
        population = numeric(row['population'], whole=True)
        published = numeric(row['published_rate_per_1000'])
        force = numeric(row['force_count'], whole=True)
        unallocated = numeric(row['force_unallocated_count'], whole=True)
        if population == 0:
            raise ValueError('Crime population must be positive or unknown')
        if force is not None and ((count is not None and count > force) or (unallocated is not None and unallocated > force)):
            raise ValueError('Crime counts exceed force total')
        rate = count / population * 1000 if count is not None and population is not None else None
        # Supplied populations are rounded; check the published rate within half
        # a rounding interval.
        if count is not None and population is not None and published is not None:
            if population <= 50 or not (count * 1000 / (population + 50) - Decimal('0.000001') <= published <= count * 1000 / (population - 50) + Decimal('0.000001')):
                raise ValueError(f'Crime rate fails published-rate reconciliation: {ident} {category}')
        observations[key] = dict(row, rate_per_1000='' if rate is None else f'{rate:.3f}',
            force_unallocated_percent='' if not force or unallocated is None else f'{unallocated / force * 100:.3f}',
            transformation='count / CSP population rounded to nearest 100 * 1000; rate rounded to 3 decimals')
    results = []
    for location in locations:
        ident = location['id']
        for category in CATEGORIES:
            mapping = mappings.get(ident, {})
            observation = observations.get((ident, category), {})
            result = dict(location_id=ident, category=category, **{k: v for k, v in mapping.items() if k != 'location_id'})
            result.update(observation)
            result.setdefault('count', '')
            result.setdefault('population', '')
            result.setdefault('rate_per_1000', '')
            result['review_status'] = (
                'Reviewed separate CSP recorded-offence rate; no safety interpretation'
                if category != 'asb' and observation else
                'ASB excluded pending force/month coverage and geography review')
            result['missing_reason'] = ('Source count or population unavailable' if observation and (observation['count'] == '' or observation['population'] == '') else '') if observation else (
                'No verified compatible CSP ASB numerator acquired; ONS appendix D4/D5 are national totals' if category == 'asb' else
                'No verified observation acquired for this location')
            results.append(result)
    return results


def export_source_tables(root):
    snapshot = root / 'data/raw/crime/2026-09-05'
    for row in read(snapshot / 'manifest.csv'):
        if hashlib.sha256((snapshot / row['file']).read_bytes()).hexdigest() != row['sha256']:
            raise ValueError('Crime snapshot hash mismatch')
    workbook = dict(sheets(snapshot / 'pfa.xlsx'))
    appendix = dict(sheets(snapshot / 'appendix.xlsx'))
    selected = {name: workbook[name] for name in ('Table C1', 'Table C2', 'Table C4', 'Notes - CSP')}
    selected.update({name: rows for name, rows in appendix.items() if name in ('Table D4', 'Table D5')})
    if 'Table D4' not in selected or 'Table D5' not in selected:
        raise ValueError('Missing ASB source tables')
    for name, rows in selected.items():
        write_csv(root / 'data/derived/crime_source_tables' / (name.replace(' ', '_') + '.csv'),
                  [dict(source_row=i, **r) for i, r in enumerate(rows, 1)])
