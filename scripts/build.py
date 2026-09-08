#!/usr/bin/env python3
"""Validate canonical CSVs and generate the broad comparison, offline."""
import csv
import json
from pathlib import Path
from extract_legacy import write_csv
from crime import compile_crime, export_source_tables
from crime_coverage import export_coverage
from crime_boundaries import export_boundaries
from crime_residuals import export_residuals
from crime_outliers import export_outliers
from release_audit import export as export_release_audit
from composite import ASSESSMENT_SCORES, compile_composite

ROOT = Path(__file__).resolve().parents[1]
GROUPS = ('buy', 'rent', 'market', 'localTransport', 'nationalTransport', 'quiet', 'condition')
NUMERIC = {'lat', 'lon', 'proxyMedian', 'transactions', 'proxyMonthly', 'oneBedCount', 'londonMinutes', 'londonChanges', 'birminghamMinutes', 'birminghamChanges'}
REQUIRED_COLUMNS = {
    'locations.csv': {'id', 'name', 'country', 'localAuthority', 'lat', 'lon'},
    'buy.csv': {'location_id', 'proxyMedian', 'transactions', 'affordabilityConfidence', 'oneBedCount', 'affordabilityReason'},
    'rent.csv': {'location_id', 'proxyMonthly', 'affordabilityConfidence', 'oneBedCount', 'affordabilityReason'},
    'market.csv': {'location_id', 'reason'},
    'localTransport.csv': {'location_id', 'assessment', 'confidence', 'evidence_ids', 'method_version', 'reason'},
    'nationalTransport.csv': {'location_id', 'londonMinutes', 'londonChanges', 'birminghamMinutes', 'birminghamChanges', 'confidence', 'reason'},
    'transport_stations.csv': {'location_id', 'station_crs', 'station_name', 'selection_reason', 'confidence', 'evidence_ids'},
    'transport_route_observations.csv': {'location_id', 'destination_id', 'origin_crs', 'destination_crs', 'measurement_date', 'selection_window_start_local', 'selection_window_end_local', 'planner_search_times', 'query_timestamp_local', 'selected_departure_local', 'selected_arrival_local', 'elapsed_minutes', 'changes', 'frequency_window_start_local', 'frequency_window_end_local', 'usable_departures_in_window', 'source_url', 'raw_capture_path', 'retrieval_timestamp', 'confidence', 'evidence_id', 'reason'},
    'quiet.csv': {'location_id', 'assessment', 'confidence', 'evidence_ids', 'method_version', 'reason'},
    'condition.csv': {'location_id', 'assessment', 'confidence', 'evidence_ids', 'method_version', 'reason'},
    'sources.csv': {'location_id', 'topic', 'url'},
    'evidence.csv': {'id', 'workstream', 'title', 'publisher', 'url', 'dataPeriod', 'retrievalDate', 'geography', 'coverage', 'limitations'},
}
ASSESSMENT_TOPICS = ('localTransport', 'condition', 'quiet')


def read(path):
    with path.open(newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames or len(set(reader.fieldnames)) != len(reader.fieldnames):
            raise ValueError(f'{path}: missing or duplicate columns')
        required = REQUIRED_COLUMNS.get(path.name)
        if required and not required.issubset(reader.fieldnames):
            missing = ', '.join(sorted(required - set(reader.fieldnames)))
            raise ValueError(f'{path}: missing required columns: {missing}')
        rows = list(reader)
    for row in rows:
        if None in row or None in row.values():
            raise ValueError(f'{path}: malformed CSV row')
        for key, value in row.items():
            if key in NUMERIC:
                if not value:
                    row[key] = None
                    continue
                number = float(value)
                import math
                if not math.isfinite(number) or (key not in ('lat', 'lon') and number < 0):
                    raise ValueError(f'{path}: invalid {key}: {value}')
                if key not in ('lat', 'lon') and not number.is_integer():
                    raise ValueError(f'{path}: expected whole number for {key}')
                row[key] = number if key in ('lat', 'lon') else int(number)
    return rows


def compile_data(inputs):
    locations = read(inputs / 'locations.csv')
    by_id = {}
    for row in locations:
        if not row.get('id') or row['id'] in by_id:
            raise ValueError('Missing or duplicate location id')
        if not row.get('name') or not row.get('country'):
            raise ValueError('Location needs a name and country')
        for key, limit in [('lat', 90), ('lon', 180)]:
            if row.get(key) is not None and abs(row[key]) > limit:
                raise ValueError(f'Invalid {key}')
        by_id[row['id']] = row
    if not locations:
        raise ValueError('No locations')
    for group in GROUPS:
        seen = set()
        for row in read(inputs / f'{group}.csv'):
            ident = row.pop('location_id')
            if ident not in by_id or ident in seen:
                raise ValueError(f'{group}: orphan or duplicate location_id {ident}')
            seen.add(ident)
            by_id[ident][group] = row
        for location in locations:
            location.setdefault(group, {})  # New locations may have unknown metrics.
    sources = read(inputs / 'sources.csv')
    for source in sources:
        if source['location_id'] not in by_id:
            raise ValueError('Source references unknown location')
        if not source['url'].startswith(('https://', 'http://')):
            raise ValueError('Source URL must use http(s)')
    evidence = read(inputs / 'evidence.csv')
    evidence_ids = {r['id'] for r in evidence}
    if len(evidence_ids) != len(evidence):
        raise ValueError('Duplicate evidence id')
    for filename in ('transport_stations.csv', 'transport_route_observations.csv'):
        seen = set()
        for row in read(inputs / filename):
            location_id = row['location_id']
            if location_id not in by_id:
                raise ValueError(f'{filename}: orphan location_id {location_id}')
            key = (location_id, row.get('destination_id', ''))
            if key in seen:
                raise ValueError(f'{filename}: duplicate location/destination row')
            seen.add(key)
    for group in ASSESSMENT_TOPICS:
        for location in locations:
            row = location[group]
            if not row:
                continue
            assessment = row['assessment']
            if assessment not in ASSESSMENT_SCORES[group]:
                allowed = ', '.join(sorted(ASSESSMENT_SCORES[group]))
                raise ValueError(f'{group}: invalid assessment {assessment!r}; expected one of {allowed}')
            if row['confidence'] not in ('High', 'Medium', 'Low'):
                raise ValueError(f'{group}: invalid confidence for {location["id"]}')
            if not row['reason'] or not row['method_version']:
                raise ValueError(f'{group}: assessment requires reason and method_version for {location["id"]}')
            row_evidence_ids = row['evidence_ids'].split(';') if row['evidence_ids'] else []
            if not row_evidence_ids or any(not item or item not in evidence_ids for item in row_evidence_ids):
                raise ValueError(f'{group}: invalid evidence_ids for {location["id"]}')
    return dict(locations=locations, sources=sources, evidence=evidence)


def build():
    data = compile_data(ROOT / 'data/inputs')
    crime = compile_crime(ROOT / 'data/inputs', data['locations'], data['evidence'])
    data['composite'] = compile_composite(data['locations'], crime)
    export_source_tables(ROOT)
    export_coverage(ROOT)
    export_boundaries(ROOT)
    export_residuals(ROOT)
    export_outliers(ROOT)
    export_release_audit(ROOT)
    write_csv(ROOT / 'data/derived/crime_research.csv', crime)
    # Separate recorded-offence research rows; never use them in broad-screen sorts.
    data['crimeResearch'] = [row for row in crime if row['category'] != 'asb']
    rows = []
    for location in data['locations']:
        row = {k: v for k, v in location.items() if not isinstance(v, dict)}
        for group in GROUPS:
            row.update({f'{group}.{k}': v for k, v in location[group].items()})
        composite = data['composite']['results'][location['id']]
        row['composite.safety'] = composite['safety']
        for tenure in ('buy', 'rent'):
            row[f'composite.{tenure}.score'] = composite['tenures'][tenure]['score']
            row[f'composite.{tenure}.band'] = composite['tenures'][tenure]['band']
            for factor, value in composite['tenures'][tenure]['factors'].items():
                row[f'composite.{tenure}.{factor}'] = value
        rows.append(row)
    write_csv(ROOT / 'data/derived/broad_screen.csv', rows)
    payload = json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False)
    (ROOT / 'web/data.js').write_text('// Generated by scripts/build.py; do not edit.\nwindow.FLATS_DATA = ' + payload + ';\n', encoding='utf-8')
    print(f'Built broad screen for {len(rows)} locations with separate buy/rent composite scores.')


if __name__ == '__main__':
    build()
