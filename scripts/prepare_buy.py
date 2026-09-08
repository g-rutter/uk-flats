#!/usr/bin/env python3
"""Prepare a reviewed HMLR probe offline from retained Price Paid CSV files."""
import argparse
import csv
from datetime import date
from itertools import chain
from pathlib import Path
from statistics import median

from csv_io import write_csv
from release_manifest import load

START, END = date(2024, 7, 1), date(2026, 6, 30)
REQUIRED = ('Price', 'Date of Transfer', 'Property Type', 'PPDCategory Type', 'Town/City', 'District')
HMLR_COLUMNS = ('Transaction unique identifier', 'Price', 'Date of Transfer', 'Postcode',
                'Property Type', 'Old/New', 'Duration', 'PAON', 'SAON', 'Street', 'Locality',
                'Town/City', 'District', 'County', 'PPDCategory Type', 'Record Status')


def read_csv(path):
    with Path(path).open(newline='', encoding='utf-8') as source:
        return list(csv.DictReader(source))


def price_rows(path, artifact):
    """Read either a headered review export or HMLR's 16-column bulk CSV."""
    with Path(path).open(newline='', encoding='utf-8') as source:
        reader = csv.reader(source)
        first = next(reader, None)
        if first is None:
            raise ValueError(f'{artifact}: empty Price Paid artifact')
        if tuple(first) == HMLR_COLUMNS:
            rows = reader
        elif set(REQUIRED).issubset(first):
            yield from csv.DictReader(source, fieldnames=first)
            return
        elif len(first) == len(HMLR_COLUMNS):
            rows = chain((first,), reader)
        else:
            raise ValueError(f'{artifact}: unexpected Price Paid schema')
        for values in rows:
            if len(values) != len(HMLR_COLUMNS):
                raise ValueError(f'{artifact}: unexpected Price Paid schema')
            yield dict(zip(HMLR_COLUMNS, values))


def mappings(path, selected):
    result = {}
    for row in read_csv(path):
        ident = row.get('location_id', '')
        if ident not in selected or ident in result:
            continue
        query_field = row.get('price_query_field', row.get('query_field', ''))
        query_value = row.get('price_query_value', row.get('query_value', ''))
        if query_field not in ('Town/City', 'District') or not query_value:
            raise ValueError(f'{ident}: query_field must be Town/City or District and query_value is required')
        result[ident] = {**row, 'query_field': query_field, 'query_value': query_value}
    missing = selected - set(result)
    if missing:
        raise ValueError(f'No reviewed price mapping for: {", ".join(sorted(missing))}')
    return result


def prepare(release, mapping_csv, probe_csv, output, audit_output):
    manifest = load(release)
    artifacts = [(name, row) for name, row in manifest.items() if name.startswith('price/')]
    if not artifacts:
        raise ValueError('Release contains no price artifacts')
    probe = read_csv(probe_csv)
    selected = {row['location_id'] for row in probe}
    mapping = mappings(mapping_csv, selected)
    values = {ident: [] for ident in selected}
    exclusions = {ident: dict(outside_window=0, non_flat=0, non_category_a=0, other_query=0) for ident in selected}
    for artifact, metadata in artifacts:
        path = Path(release) / artifact
        for row in price_rows(path, artifact):
                try:
                    transfer = date.fromisoformat(row['Date of Transfer'][:10])
                except ValueError as exc:
                    raise ValueError(f'{artifact}: invalid Date of Transfer') from exc
                for ident, rule in mapping.items():
                    if row[rule['query_field']] != rule['query_value']:
                        exclusions[ident]['other_query'] += 1
                        continue
                    if not START <= transfer <= END:
                        exclusions[ident]['outside_window'] += 1
                    elif row['Property Type'] != 'F':
                        exclusions[ident]['non_flat'] += 1
                    elif row['PPDCategory Type'] != 'A':
                        exclusions[ident]['non_category_a'] += 1
                    else:
                        values[ident].append(int(row['Price']))
    rows, audits = [], []
    for ident in sorted(selected):
        chosen = sorted(values[ident])
        raw_median = median(chosen) if chosen else ''
        # The display proxy is whole pounds.  For the only possible fractional
        # median (the midpoint of two integer prices), retain the established
        # half-up rounding rule rather than Python's ties-to-even behaviour.
        value = (int(raw_median * 2 + 1) // 2) if raw_median != '' else ''
        rendered = str(value) if value != '' else ''
        rows.append(dict(location_id=ident, proxyMedian=rendered, transactions=len(chosen)))
        rule = mapping[ident]
        audits.append(dict(location_id=ident, query_field=rule['query_field'], query_value=rule['query_value'],
            period_start=START.isoformat(), period_end=END.isoformat(), selected_rows=len(chosen),
            raw_median=str(raw_median), proxy_median=rendered, selected_prices=';'.join(map(str, chosen)),
            source_artifacts=';'.join(name for name, _ in artifacts),
            source_sha256=';'.join(metadata['sha256'] for _, metadata in artifacts),
            **exclusions[ident]))
    write_csv(output, rows, ('location_id', 'proxyMedian', 'transactions'))
    write_csv(audit_output, audits, ('location_id', 'query_field', 'query_value', 'period_start', 'period_end',
              'selected_rows', 'raw_median', 'proxy_median', 'selected_prices', 'source_artifacts', 'source_sha256',
              'outside_window', 'non_flat', 'non_category_a', 'other_query'))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', type=Path, required=True)
    parser.add_argument('--mappings', type=Path, required=True)
    parser.add_argument('--probe', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--audit-output', type=Path, required=True)
    args = parser.parse_args()
    prepare(args.release, args.mappings, args.probe, args.output, args.audit_output)
