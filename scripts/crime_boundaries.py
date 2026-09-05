"""Audit canonical crime mappings against a dated ONS relationship lookup.

Matching codes do not establish identical boundaries or monthly coverage. This
module does not assign LSOAs to CSPs.
"""
from collections import defaultdict
import hashlib
import json

from crime import read
from extract_legacy import write_csv


def load_lookup(snapshot):
    manifest = {r['file']: r for r in read(snapshot / 'manifest.csv')}
    for name in ('csp-item.json', 'csp-lookup.json', 'police-download.html', 'police-about.html'):
        if hashlib.sha256((snapshot / name).read_bytes()).hexdigest() != manifest[name]['sha256']:
            raise ValueError(f'Boundary snapshot hash mismatch: {name}')
    item = json.loads((snapshot / 'csp-item.json').read_text())
    if item.get('id') != '8f77bda25c124e43aca5f3b90494e405' or '1st April 2025' not in item.get('description', ''):
        raise ValueError('Unrecognised boundary lookup edition')
    payload = json.loads((snapshot / 'csp-lookup.json').read_text())
    if 'error' in payload or payload.get('exceededTransferLimit') or not payload.get('features'):
        raise ValueError('Incomplete boundary lookup response')
    rows = [r['attributes'] for r in payload['features']]
    seen = set()
    for row in rows:
        if any(not row.get(k) for k in ('LAD25CD', 'LAD25NM', 'CSP25CD', 'CSP25NM', 'PFA25CD')):
            raise ValueError('Missing boundary identity')
        key = row['LAD25CD'], row['CSP25CD']
        if key in seen:
            raise ValueError('Duplicate LA/CSP relationship')
        seen.add(key)
    return rows, manifest


def audit(locations, mappings, observations, lookup, manifest):
    by_la, by_csp = defaultdict(list), defaultdict(list)
    for row in lookup:
        by_la[row['LAD25CD']].append(row)
        by_csp[row['CSP25CD']].append(row)
    mapped = {r['location_id']: r for r in mappings}
    forces = defaultdict(set)
    for row in observations:
        forces[row['location_id']].add(row['force_code'])
    results = []
    for location in locations:
        identity = location['id']
        mapping = mapped.get(identity, {})
        la, csp = mapping.get('local_authority_code', ''), mapping.get('csp_code', '')
        members = by_csp[csp]
        pair = [r for r in members if r['LAD25CD'] == la]
        issues = []
        if not mapping:
            issues.append('No canonical crime mapping')
        elif not members:
            issues.append('CSP absent from April 2025 lookup')
        elif not pair:
            issues.append('Canonical LA/CSP pair absent; reconcile code and boundary changes')
        if pair and pair[0]['CSP25NM'] != mapping['csp_name']:
            issues.append('CSP name differs')
        if members and forces[identity] != {r['PFA25CD'] for r in members}:
            issues.append('Observation force missing or differs from lookup')
        split = any(len(by_la[r['LAD25CD']]) > 1 for r in members)
        if split:
            issues.append('LA contains multiple CSPs; LA-only LSOA join is ambiguous')
        if not issues:
            issues.append('Codes agree; boundary footprint and LSOA membership still unverified')
        results.append(dict(location_id=identity, canonical_la_code=la,
            canonical_csp_code=csp, canonical_csp_name=mapping.get('csp_name', ''),
            lookup_date='2025-04-01',
            pair_match='yes' if pair else 'no' if mapping else '',
            lookup_member_la_codes=' | '.join(sorted({r['LAD25CD'] for r in members})),
            lookup_member_la_names=' | '.join(sorted({r['LAD25NM'] for r in members})),
            lookup_force_codes=' | '.join(sorted({r['PFA25CD'] for r in members})),
            includes_split_la='yes' if split else 'no' if members else '',
            review_reason='; '.join(issues),
            boundary_compatibility='Unverified', lsoa_to_csp_ready='no',
            source_url=manifest['csp-lookup.json']['url'],
            retrieved_at=manifest['csp-lookup.json']['retrieved_at'],
            source_sha256=manifest['csp-lookup.json']['sha256'],
            metadata_url=manifest['csp-item.json']['url'],
            metadata_retrieved_at=manifest['csp-item.json']['retrieved_at'],
            metadata_sha256=manifest['csp-item.json']['sha256']))
    return results


def export_boundaries(root):
    lookup, manifest = load_lookup(root / 'data/raw/crime/boundaries-2026-09-05')
    rows = audit(read(root / 'data/inputs/locations.csv'),
                 read(root / 'data/inputs/crime_geographies.csv'),
                 read(root / 'data/inputs/crime_observations.csv'), lookup, manifest)
    write_csv(root / 'data/derived/crime_boundary_audit.csv', rows)
