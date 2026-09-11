#!/usr/bin/env python3
"""Generate a deterministic provenance/readiness checklist for each location."""
import csv
from pathlib import Path

from csv_io import write_csv

TOPICS = ('buy', 'rent', 'market', 'localTransport', 'nationalTransport',
          'residentialEnvironment', 'digitalConnectivity', 'crime')
FILES = {
    'residentialEnvironment': 'residential_environment.csv',
    'digitalConnectivity': 'digital_connectivity.csv',
}


def read(path):
    with Path(path).open(newline='', encoding='utf-8') as source:
        return list(csv.DictReader(source))


def index(rows, key='location_id'):
    return {row[key]: row for row in rows}


def metric_present(topic, row):
    if not row:
        return False
    fields = {
        'buy': ('proxyMedian', 'transactions', 'oneBedCount'),
        'rent': ('proxyMonthly', 'oneBedCount'),
        'market': ('reason',),
        'localTransport': ('pt_connectivity_0_100', 'score'),
        'nationalTransport': ('londonMinutes', 'birminghamMinutes'),
        'residentialEnvironment': ('environment_index_0_100', 'score'),
        'digitalConnectivity': ('gigabit_availability_pct',),
        'crime': ('count', 'population'),
    }[topic]
    return any(row.get(field, '') for field in fields)


def audit(inputs):
    locations = read(Path(inputs) / 'locations.csv')
    tables = {topic: index(read(Path(inputs) / FILES.get(topic, f'{topic}.csv')))
              for topic in TOPICS if topic != 'crime'}
    crime = {}
    for row in read(Path(inputs) / 'crime_observations.csv'):
        if row['category'] in ('violence_against_person', 'sexual_offences'):
            crime.setdefault(row['location_id'], []).append(row)
    result = []
    for location in locations:
        ident = location['id']
        for topic in TOPICS:
            if topic == 'crime':
                rows = crime.get(ident, [])
                present = len(rows) == 2 and all(metric_present('crime', row) for row in rows)
                artifact_hash = rows[0]['source_sha256'] if rows else ''
                period = '; '.join(sorted({f"{r['period_start']} to {r['period_end']}" for r in rows}))
                geography = '; '.join(sorted({r['csp_code'] for r in rows}))
                status = 'ready' if present and artifact_hash else 'missing'
                reason = '' if status == 'ready' else 'No complete compatible CSP observation retained'
            else:
                row = tables[topic].get(ident, {})
                present = metric_present(topic, row)
                artifact_hash = ''
                period = ''
                geography = location['localAuthority']
                if topic == 'market':
                    try:
                        from prepare_market_stock import retained_observation
                        observation = retained_observation(ident)
                    except (OSError, ValueError):
                        observation = None
                    buy, rent = tables['buy'].get(ident, {}), tables['rent'].get(ident, {})
                    if observation and row and buy.get('oneBedCount') == str(observation['sale']) and rent.get('oneBedCount') == str(observation['rent']):
                        status, artifact_hash = 'ready', observation['capture_hashes']
                        geography = observation['portal_regions']
                        reason = ''
                    elif observation:
                        status = 'review-required' if present else 'missing'
                        reason = ('No checked retained market capture matches the canonical counts'
                                  if present else 'No observation supplied')
                    else:
                        status = 'review-required' if present else 'missing'
                        reason = ('Imported baseline value has no retained row-level raw artifact'
                                  if present else 'No observation supplied')
                elif topic == 'localTransport' and present:
                    from release_manifest import load
                    release = Path(inputs).parent / 'raw/releases/2026-09-09-local-transport'
                    try:
                        manifest = load(release)
                        artifact_hash = manifest['connectivity_metrics_2025.ods']['sha256']
                        status = 'ready'
                        period = row['source_period']
                        geography = row['geography_code']
                        reason = ''
                    except (OSError, ValueError, KeyError):
                        status = 'review-required'
                        reason = 'Canonical observation does not match a complete hash-verified local-transport release'
                elif topic == 'residentialEnvironment' and present:
                    from release_manifest import load
                    release = Path(inputs).parent / 'raw/environment/2026-09-09'
                    try:
                        manifest = load(release)
                        artifact_hash = ';'.join(sorted(item['sha256'] for item in manifest.values()))
                        status = 'ready'
                        period = '; '.join(row[field] for field in
                                           ('air_period', 'quiet_period', 'green_period',
                                            'housing_environment_period'))
                        geography = row['geography_code']
                        reason = ''
                    except (OSError, ValueError, KeyError):
                        status = 'review-required'
                        reason = 'Canonical observation does not match a complete hash-verified residential-environment release'
                elif topic == 'digitalConnectivity' and present:
                    from release_manifest import load
                    release = Path(inputs).parent / 'raw/connectivity/2026-09-11'
                    try:
                        manifest = load(release)
                        artifact_hash = manifest['fixed-coverage-output-areas.zip']['sha256']
                        status = 'ready'
                        period = row['source_period']
                        geography = row['geography_code']
                        reason = ''
                    except (OSError, ValueError, KeyError):
                        status = 'review-required'
                        reason = 'Canonical observation does not match a complete hash-verified Ofcom release'
                else:
                    # The current non-crime dataset is explicitly an imported baseline;
                    # it cannot acquire a raw-artifact claim merely by having a URL.
                    status = 'review-required' if present else 'missing'
                    reason = ('Imported baseline value has no retained row-level raw artifact'
                              if present else 'No observation supplied')
            result.append(dict(location_id=ident, topic=topic, status=status,
                geography=geography, source_period=period, artifact_hash=artifact_hash,
                reason=reason))
    return result


def export(root):
    write_csv(Path(root) / 'data/derived/release_audit.csv', audit(Path(root) / 'data/inputs'),
              ('location_id', 'topic', 'status', 'geography', 'source_period', 'artifact_hash', 'reason'))
