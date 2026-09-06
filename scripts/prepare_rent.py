#!/usr/bin/env python3
"""Extract July-2026 one-bedroom PIPR LA means from a retained workbook."""
import argparse
import csv
from pathlib import Path

from crime_workbook import sheets
from extract_legacy import write_csv
from release_manifest import load

HEADER = {'A': 'Time period', 'B': 'Area code', 'C': 'Area name', 'L': 'Rental price one bed'}
JULY_2026 = '46204'  # Excel serial for 2026-07-01; values are monthly means in GBP.


def read_csv(path):
    with Path(path).open(newline='', encoding='utf-8') as source:
        return list(csv.DictReader(source))


def prepare(release, mappings_csv, probe_csv, output, audit_output):
    manifest = load(release)
    artifacts = [(name, row) for name, row in manifest.items() if name.startswith('rent/')]
    if len(artifacts) != 1:
        raise ValueError('Probe needs exactly one retained rent workbook')
    artifact, metadata = artifacts[0]
    table = dict(sheets(Path(release) / artifact)).get('Table 1')
    if not table or table[2] != {**table[2], **HEADER}:
        raise ValueError('Unexpected PIPR Table 1 header/layout')
    selected = {row['location_id'] for row in read_csv(probe_csv)}
    mappings = {row['location_id']: row for row in read_csv(mappings_csv) if row['location_id'] in selected}
    if selected != set(mappings):
        raise ValueError('Probe rent mappings are incomplete or duplicated')
    source_rows = {row['B']: row for row in table[3:] if row.get('A') == JULY_2026}
    output_rows, audit_rows = [], []
    for ident in sorted(selected):
        mapping = mappings[ident]
        row = source_rows.get(mapping['rent_la_code'])
        if not row or row.get('C') != mapping['rent_la_name'] or row.get('L') in ('', '[x]', '[z]'):
            raise ValueError(f'{ident}: no compatible July-2026 PIPR row')
        value = int(row['L'])
        output_rows.append(dict(location_id=ident, proxyMonthly=value))
        audit_rows.append(dict(location_id=ident, rent_la_code=mapping['rent_la_code'],
            rent_la_name=mapping['rent_la_name'], sheet='Table 1', source_row=table.index(row) + 1,
            source_cells=f'Table 1!A{table.index(row) + 1};B{table.index(row) + 1};C{table.index(row) + 1};L{table.index(row) + 1}',
            time_period='2026-07', proxy_monthly=value, source_artifact=artifact,
            source_sha256=metadata['sha256'], edition='19 August 2026', provisional_status='See ONS workbook notes'))
    write_csv(output, output_rows, ('location_id', 'proxyMonthly'))
    write_csv(audit_output, audit_rows, ('location_id', 'rent_la_code', 'rent_la_name', 'sheet', 'source_row',
              'source_cells', 'time_period', 'proxy_monthly', 'source_artifact', 'source_sha256', 'edition',
              'provisional_status'))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--release', type=Path, required=True)
    parser.add_argument('--mappings', type=Path, required=True)
    parser.add_argument('--probe', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--audit-output', type=Path, required=True)
    args = parser.parse_args()
    prepare(args.release, args.mappings, args.probe, args.output, args.audit_output)
