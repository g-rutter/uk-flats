#!/usr/bin/env python3
"""Prepare a reviewed HMLR probe offline from retained Price Paid CSV files."""
import argparse
import csv
from datetime import date
from pathlib import Path
from statistics import median

from extract_legacy import write_csv
from release_manifest import load

START, END = date(2024, 7, 1), date(2026, 6, 30)
REQUIRED = ('Price', 'Date of Transfer', 'Property Type', 'PPDCategory Type', 'Town/City', 'District')


def read_csv(path):
    with Path(path).open(newline='', encoding='utf-8') as source:
        return list(csv.DictReader(source))


def mappings(path, selected):
    result = {}
    for row in read_csv(path):
        ident = row.get('location_id', '')
        if ident not in selected or ident in result:
            continue
        if row.get('query_field') not in ('Town/City', 'District') or not row.get('query_value'):
            raise ValueError(f'{ident}: query_field must be Town/City or District and query_value is required')
        result[ident] = row
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
        with path.open(newline='', encoding='utf-8') as source:
            reader = csv.DictReader(source)
            if not reader.fieldnames or not set(REQUIRED).issubset(reader.fieldnames):
                raise ValueError(f'{artifact}: unexpected Price Paid schema')
            for row in reader:
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
        value = median(chosen) if chosen else ''
        rendered = str(int(value)) if value != '' and value == int(value) else str(value)
        rows.append(dict(location_id=ident, proxyMedian=rendered, transactions=len(chosen)))
        rule = mapping[ident]
        audits.append(dict(location_id=ident, query_field=rule['query_field'], query_value=rule['query_value'],
            period_start=START.isoformat(), period_end=END.isoformat(), selected_rows=len(chosen),
            proxy_median=rendered, selected_prices=';'.join(map(str, chosen)),
            source_artifacts=';'.join(name for name, _ in artifacts),
            source_sha256=';'.join(metadata['sha256'] for _, metadata in artifacts),
            **exclusions[ident]))
    write_csv(output, rows, ('location_id', 'proxyMedian', 'transactions'))
    write_csv(audit_output, audits, ('location_id', 'query_field', 'query_value', 'period_start', 'period_end',
              'selected_rows', 'proxy_median', 'selected_prices', 'source_artifacts', 'source_sha256',
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
