#!/usr/bin/env python3
"""Validate accepted expansion mappings and produce reviewable CSV candidates."""
import argparse
import csv
from pathlib import Path
import re

from csv_io import write_csv
from release_manifest import load

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = ('location_id', 'status', 'release_id', 'display_name', 'country',
            'lat', 'lon', 'centroid_source', 'centroid_query',
            'local_authority_code', 'local_authority_name', 'price_query_field',
            'price_query_value', 'rent_la_code', 'csp_code', 'csp_name',
            'portal_resolver_query', 'portal_region_id', 'lookup_artifact',
            'lookup_edition', 'exception_rationale', 'missing_data_reason')
MAPPING_FIELDS = REQUIRED[3:20]


def rows(path):
    with Path(path).open(newline='', encoding='utf-8') as source:
        reader = csv.DictReader(source)
        if not reader.fieldnames or set(REQUIRED) - set(reader.fieldnames):
            raise ValueError('Location registry has missing required columns')
        result = list(reader)
    if any(None in row or None in row.values() for row in result):
        raise ValueError('Location registry has malformed row')
    return result


def prepare(registry, raw_root, locations_output, crime_output):
    accepted, identifiers = [], set()
    for row in rows(registry):
        ident, status = row['location_id'], row['status']
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', ident) or ident in identifiers:
            raise ValueError('Location registry has missing or duplicate stable location_id')
        identifiers.add(ident)
        if status not in ('proposed', 'accepted'):
            raise ValueError(f'{ident}: status must be proposed or accepted')
        if status == 'proposed':
            if not row['missing_data_reason']:
                raise ValueError(f'{ident}: proposed row needs missing_data_reason')
            continue
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', row['release_id']):
            raise ValueError(f'{ident}: accepted row needs ISO release_id')
        if any(not row[field] for field in MAPPING_FIELDS) or not row['exception_rationale']:
            raise ValueError(f'{ident}: accepted row has unresolved mapping')
        if row['country'] not in ('England', 'Wales'):
            raise ValueError(f'{ident}: country is outside approved scope')
        try:
            lat, lon = float(row['lat']), float(row['lon'])
        except ValueError as exc:
            raise ValueError(f'{ident}: invalid centroid') from exc
        if not -90 <= lat <= 90 or not -180 <= lon <= 180:
            raise ValueError(f'{ident}: invalid centroid')
        if not re.fullmatch(r'(E22|W14)\d{6}', row['csp_code']):
            raise ValueError(f'{ident}: invalid CSP code')
        release_dir = Path(raw_root) / row['release_id']
        manifest = load(release_dir)
        artifact = row['lookup_artifact']
        if artifact not in manifest:
            raise ValueError(f'{ident}: lookup artifact is not retained in its declared release')
        accepted.append(row)
    write_csv(locations_output, [dict(id=row['location_id'], name=row['display_name'],
        country=row['country'], localAuthority=row['local_authority_name'],
        lat=row['lat'], lon=row['lon']) for row in accepted],
        ('id', 'name', 'country', 'localAuthority', 'lat', 'lon'))
    write_csv(crime_output, [dict(location_id=row['location_id'],
        local_authority_code=row['local_authority_code'], csp_code=row['csp_code'],
        csp_name=row['csp_name'], boundary_vintage=row['lookup_edition'],
        boundary_basis=f'Retained lookup artifact {row["lookup_artifact"]}',
        mapping_reason=row['exception_rationale']) for row in accepted],
        ('location_id', 'local_authority_code', 'csp_code', 'csp_name', 'boundary_vintage',
         'boundary_basis', 'mapping_reason'))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--registry', type=Path, default=ROOT / 'data/registry/location_registry.csv')
    parser.add_argument('--raw-root', type=Path, default=ROOT / 'data/raw/releases')
    parser.add_argument('--locations-output', type=Path, required=True)
    parser.add_argument('--crime-output', type=Path, required=True)
    args = parser.parse_args()
    prepare(args.registry, args.raw_root, args.locations_output, args.crime_output)
