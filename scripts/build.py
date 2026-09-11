#!/usr/bin/env python3
"""Validate canonical CSVs and generate the broad comparison, offline."""
import csv
import json
from collections import defaultdict
from pathlib import Path
from csv_io import write_csv
from crime import compile_crime, export_source_tables
from crime_coverage import export_coverage
from crime_boundaries import export_boundaries
from crime_residuals import export_residuals
from crime_outliers import export_outliers
from release_audit import export as export_release_audit
from composite import compile_composite
from residential_environment import BOUNDARY_RULE, METHOD_VERSION, score_for
from release_manifest import load as load_manifest

ROOT = Path(__file__).resolve().parents[1]
GROUP_FILES = {
    'buy': 'buy.csv', 'rent': 'rent.csv', 'market': 'market.csv',
    'localTransport': 'localTransport.csv', 'nationalTransport': 'nationalTransport.csv',
    'residentialEnvironment': 'residential_environment.csv',
}
GROUPS = tuple(GROUP_FILES)
INTEGER_NUMERIC = {
    'proxyMedian', 'transactions', 'proxyMonthly', 'oneBedCount', 'londonMinutes',
    'londonChanges', 'birminghamMinutes', 'birminghamChanges', 'score',
    'population_covered', 'population_expected', 'air_population_covered',
    'quiet_population_covered', 'green_population_covered',
    'housing_environment_population_covered', 'reference_bua_count', 'reference_population',
}
FLOAT_NUMERIC = {
    'lat', 'lon', 'pt_connectivity_0_100', 'national_percentile', 'air_burden',
    'no2_ug_m3', 'pm25_ug_m3', 'pm10_ug_m3', 'noise_exposed_pct',
    'green_within_300m_pct', 'green_area_within_1000m_m2', 'epc_sap_mean',
    'air_percentile', 'quiet_percentile', 'green_percentile',
    'housing_environment_percentile', 'environment_index_0_100',
}
REQUIRED_COLUMNS = {
    'locations.csv': {'id', 'name', 'country', 'localAuthority', 'lat', 'lon'},
    'buy.csv': {'location_id', 'proxyMedian', 'transactions', 'housingCostConfidence', 'oneBedCount', 'housingCostReason'},
    'rent.csv': {'location_id', 'proxyMonthly', 'housingCostConfidence', 'oneBedCount', 'housingCostReason'},
    'market.csv': {'location_id', 'reason'},
    'localTransport.csv': {'location_id', 'pt_connectivity_0_100', 'national_percentile', 'score', 'source_period', 'retrieval_date', 'evidence_id', 'geography_code', 'geography_vintage', 'population_covered', 'population_expected', 'method_version', 'confidence', 'reason'},
    'location_geographies.csv': {'location_id', 'geography_type', 'geography_name', 'boundary_vintage', 'mapping_basis', 'confidence', 'reason'},
    'location_geography_components.csv': {'location_id', 'geography_code', 'geography_name'},
    'local_transport_release.csv': {'release_id', 'method_version', 'metric_field', 'population_vintage', 'geography_vintage', 'national_population', 'national_oa_count', 'minimum', 'q20', 'q40', 'q60', 'q80', 'maximum', 'boundary_rule'},
    'nationalTransport.csv': {'location_id', 'londonMinutes', 'londonChanges', 'birminghamMinutes', 'birminghamChanges', 'confidence', 'reason'},
    'transport_stations.csv': {'location_id', 'station_crs', 'station_name', 'selection_reason', 'confidence', 'evidence_ids'},
    'transport_route_observations.csv': {'location_id', 'destination_id', 'origin_crs', 'destination_crs', 'measurement_date', 'selection_window_start_local', 'selection_window_end_local', 'planner_search_times', 'query_timestamp_local', 'selected_departure_local', 'selected_arrival_local', 'elapsed_minutes', 'changes', 'frequency_window_start_local', 'frequency_window_end_local', 'usable_departures_in_window', 'source_url', 'raw_capture_path', 'retrieval_timestamp', 'confidence', 'evidence_id', 'reason'},
    'residential_environment.csv': {'location_id', 'air_burden', 'no2_ug_m3', 'pm25_ug_m3', 'pm10_ug_m3', 'noise_exposed_pct', 'green_within_300m_pct', 'green_area_within_1000m_m2', 'epc_sap_mean', 'air_percentile', 'quiet_percentile', 'green_percentile', 'housing_environment_percentile', 'environment_index_0_100', 'national_percentile', 'score', 'air_period', 'quiet_period', 'green_period', 'housing_environment_period', 'air_evidence_id', 'quiet_evidence_id', 'green_evidence_id', 'housing_environment_evidence_id', 'geography_code', 'geography_vintage', 'air_population_covered', 'quiet_population_covered', 'green_population_covered', 'housing_environment_population_covered', 'population_expected', 'method_version', 'confidence', 'reason'},
    'residential_environment_release.csv': {'release_id', 'method_version', 'reference_bua_count', 'reference_population', 'q20', 'q40', 'q60', 'q80', 'boundary_rule', 'pillar_weights', 'quiet_standardisation', 'housing_environment_standardisation', 'cross_border_bua_country_rule'},
    'sources.csv': {'location_id', 'topic', 'url'},
    'evidence.csv': {'id', 'workstream', 'title', 'publisher', 'url', 'dataPeriod', 'retrievalDate', 'geography', 'coverage', 'limitations'},
}
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
            if key in INTEGER_NUMERIC | FLOAT_NUMERIC:
                if not value:
                    row[key] = None
                    continue
                number = float(value)
                import math
                if not math.isfinite(number) or (key not in ('lat', 'lon') and number < 0):
                    raise ValueError(f'{path}: invalid {key}: {value}')
                if key in INTEGER_NUMERIC and not number.is_integer():
                    raise ValueError(f'{path}: expected whole number for {key}')
                row[key] = int(number) if key in INTEGER_NUMERIC else number
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
    for group, filename in GROUP_FILES.items():
        seen = set()
        for row in read(inputs / filename):
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
    releases = read(inputs / 'local_transport_release.csv')
    if len(releases) != 1:
        raise ValueError('local transport requires exactly one release-method row')
    release = releases[0]
    cutpoints = [float(release[key]) for key in ('q20', 'q40', 'q60', 'q80')]
    if cutpoints != sorted(cutpoints) or release['boundary_rule'] != 'A value equal to a threshold enters the higher score band.':
        raise ValueError('local transport release has invalid thresholds or boundary rule')
    mappings = read(inputs / 'location_geographies.csv')
    mapped_ids = [row['location_id'] for row in mappings]
    if len(mapped_ids) != len(set(mapped_ids)) or not set(mapped_ids) <= set(by_id):
        raise ValueError('location geographies contain duplicate or unknown locations')
    components = read(inputs / 'location_geography_components.csv')
    component_ids = {row['location_id'] for row in components}
    if component_ids != set(mapped_ids) or any(row['location_id'] not in by_id for row in components):
        raise ValueError('location geography components must cover every reviewed mapping')
    for location in locations:
        row = location['localTransport']
        if not row:
            continue
        if location['id'] not in set(mapped_ids):
            raise ValueError(f'localTransport: missing reviewed geography for {location["id"]}')
        value, percentile, score = row['pt_connectivity_0_100'], row['national_percentile'], row['score']
        if not 0 <= value <= 100 or not 0 <= percentile <= 100 or score not in range(1, 6):
            raise ValueError(f'localTransport: invalid metric or score for {location["id"]}')
        expected_score = 1 + sum(value >= threshold for threshold in cutpoints)
        if score != expected_score:
            raise ValueError(f'localTransport: score does not match national thresholds for {location["id"]}')
        if row['population_covered'] != row['population_expected'] or row['population_expected'] <= 0:
            raise ValueError(f'localTransport: incomplete population coverage for {location["id"]}')
        if row['evidence_id'] not in evidence_ids or row['method_version'] != release['method_version']:
            raise ValueError(f'localTransport: invalid evidence or method version for {location["id"]}')
        if row['confidence'] not in ('High', 'Medium', 'Low') or not row['reason']:
            raise ValueError(f'localTransport: incomplete evidence context for {location["id"]}')
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
    environment_releases = read(inputs / 'residential_environment_release.csv')
    if len(environment_releases) != 1:
        raise ValueError('residential environment requires exactly one release-method row')
    environment_release = environment_releases[0]
    environment_cutpoints = [float(environment_release[key]) for key in ('q20', 'q40', 'q60', 'q80')]
    if (environment_release['method_version'] != METHOD_VERSION or
            environment_release['boundary_rule'] != BOUNDARY_RULE or
            environment_release['pillar_weights'] != 'air=25;quiet=25;green=25;housing_environment=25' or
            environment_release['quiet_standardisation'] != 'population-weighted percentile within England or Wales' or
            environment_release['housing_environment_standardisation'] != 'population-weighted percentile within England or Wales' or
            environment_cutpoints != sorted(environment_cutpoints) or
            environment_release['reference_bua_count'] <= 0 or
            environment_release['reference_population'] <= 0):
        raise ValueError('residential environment release controls are invalid')
    component_codes = defaultdict(set)
    for component in components:
        component_codes[component['location_id']].add(component['geography_code'])
    for location in locations:
        row = location['residentialEnvironment']
        if not row:
            continue
        ident = location['id']
        bounded = ('noise_exposed_pct', 'green_within_300m_pct', 'epc_sap_mean',
                   'air_percentile', 'quiet_percentile', 'green_percentile',
                   'housing_environment_percentile', 'environment_index_0_100',
                   'national_percentile')
        if any(row[field] is None or not 0 <= row[field] <= 100 for field in bounded):
            raise ValueError(f'residentialEnvironment: invalid bounded metric for {ident}')
        positive = ('air_burden', 'no2_ug_m3', 'pm25_ug_m3', 'pm10_ug_m3',
                    'green_area_within_1000m_m2')
        if any(row[field] is None or row[field] < 0 for field in positive):
            raise ValueError(f'residentialEnvironment: invalid raw metric for {ident}')
        burden = (row['no2_ug_m3'] / 10 + row['pm25_ug_m3'] / 5 + row['pm10_ug_m3'] / 15) / 3
        if abs(burden - row['air_burden']) > 0.00015:
            raise ValueError(f'residentialEnvironment: air burden does not reproduce for {ident}')
        reproduced_index = sum(row[f'{pillar}_percentile'] for pillar in
                               ('air', 'quiet', 'green', 'housing_environment')) / 4
        if abs(reproduced_index - row['environment_index_0_100']) > 0.001:
            raise ValueError(f'residentialEnvironment: index does not reproduce for {ident}')
        if row['score'] not in range(1, 6) or row['score'] != score_for(row['environment_index_0_100'], environment_cutpoints):
            raise ValueError(f'residentialEnvironment: score does not match national thresholds for {ident}')
        coverage = [row[f'{pillar}_population_covered'] for pillar in
                    ('air', 'quiet', 'green', 'housing_environment')]
        if row['population_expected'] <= 0 or any(value != row['population_expected'] for value in coverage):
            raise ValueError(f'residentialEnvironment: incomplete population coverage for {ident}')
        if set(row['geography_code'].split(';')) != component_codes[ident]:
            raise ValueError(f'residentialEnvironment: geography components differ for {ident}')
        row_evidence = [row[f'{pillar}_evidence_id'] for pillar in
                        ('air', 'quiet', 'green', 'housing_environment')]
        periods = [row[f'{pillar}_period'] for pillar in
                   ('air', 'quiet', 'green', 'housing_environment')]
        if (row['method_version'] != METHOD_VERSION or any(item not in evidence_ids for item in row_evidence) or
                any(not period for period in periods) or row['confidence'] not in ('High', 'Medium', 'Low') or
                not row['reason'] or row['geography_vintage'] != 'April 2024'):
            raise ValueError(f'residentialEnvironment: incomplete evidence context for {ident}')
    return dict(locations=locations, sources=sources, evidence=evidence)


def build():
    environment_manifest = load_manifest(ROOT / 'data/raw/environment/2026-09-09')
    if set(environment_manifest) != {
            'iod2025-domains-v2.xlsx', 'iod2025-underlying-indicators-v2.xlsx',
            'wimd2025-physical-environment.csv', 'wimd2025-housing.csv',
            'wimd2025-domain-ranks.csv', 'defra-no2-2024.csv', 'defra-pm25-2024.csv',
            'defra-pm10-2024.csv', 'os-open-greenspace-product.json',
            'os-open-greenspace-gb.gpkg.zip', 'oa21-population-weighted-centroids.csv',
            'oa21-lsoa21-msoa21-lookup.csv'}:
        raise ValueError('Residential-environment raw release is incomplete')
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
