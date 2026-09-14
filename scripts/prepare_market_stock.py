#!/usr/bin/env python3
"""Prepare expansion stock counts from retained, controlled Rightmove captures."""
import csv
import json
import re
from pathlib import Path

from csv_io import write_csv
from release_manifest import load


ROOT = Path(__file__).resolve().parents[1]
RELEASE = ROOT / 'data/raw/releases/2026-09-07-location-expansion'
NEW_RELEASE = ROOT / 'data/raw/releases/2026-09-14-new-location-market-stock'
NEW_MAPPINGS = ROOT / 'data/registry/new_location_market_mappings.csv'
RESULT_COUNT = re.compile(r'"resultCount":"([0-9]+)"')
LOCATIONS = {
    'bristol': [('bristol', '219', 'Bristol')],
    'southampton': [('southampton', '1231', 'Southampton, Hampshire')],
    'bournemouth-poole': [('bournemouth-poole-bournemouth', '194', 'Bournemouth, Dorset'),
                           ('bournemouth-poole-poole', '1079', 'Poole, Dorset')],
    'brighton-hove': [('brighton-hove', '61480', 'Brighton and Hove')],
    'exeter': [('exeter', '494', 'Exeter, Devon')], 'reading': [('reading', '1114', 'Reading, Berkshire')],
    'milton-keynes': [('milton-keynes', '940', 'Milton Keynes, Buckinghamshire')],
    'luton': [('luton', '876', 'Luton, Bedfordshire')],
    'southend-on-sea': [('southend-on-sea', '1232', 'Southend-On-Sea, Essex')],
    'cambridge': [('cambridge', '274', 'Cambridge, Cambridgeshire')],
    'colchester': [('colchester', '347', 'Colchester, Essex')], 'oxford': [('oxford', '1036', 'Oxford, Oxfordshire')],
    'bath': [('bath', '116', 'Bath, Somerset')],
    'bridgend': [('bridgend', '210', 'Bridgend, Bridgend (County of), Mid Glamorgan')],
    'llanelli': [('llanelli', '827', 'Llanelli, Carmarthenshire, Mid Wales')],
    'bangor': [('bangor', '98', 'Bangor, Gwynedd')], 'rhyl': [('rhyl', '1125', 'Rhyl, Denbighshire')],
    'york': [('york', '1498', 'York, North Yorkshire')], 'durham': [('durham', '460', 'Durham, County Durham')],
    'cheltenham': [('cheltenham', '308', 'Cheltenham, Gloucestershire')],
}


def read(path):
    with Path(path).open(newline='', encoding='utf-8') as source:
        return list(csv.DictReader(source))


def count(manifest, component, tenure):
    relative = f'market-stock/search/{component}-{tenure}.html'
    if relative not in manifest:
        raise ValueError(f'Manifest lacks {relative}')
    found = RESULT_COUNT.findall((RELEASE / relative).read_text(encoding='utf-8'))
    if len(found) != 1:
        raise ValueError(f'{relative}: expected exactly one resultCount, found {len(found)}')
    return int(found[0]), manifest[relative]


def verify_resolver(manifest, component, region, name):
    # Composite aliases deliberately rely on the captures made with their named components.
    resolver = component.replace('bournemouth-poole-bournemouth', 'bournemouth').replace('bournemouth-poole-poole', 'poole').replace('brighton-hove', 'brighton')
    relative = f'market-stock/resolver/{resolver}.json'
    if relative not in manifest:
        raise ValueError(f'Manifest lacks {relative}')
    matches = json.loads((RELEASE / relative).read_text(encoding='utf-8')).get('matches', [])
    if not any(str(item.get('id')) == region and item.get('type') == 'REGION' and item.get('displayName') == name for item in matches):
        raise ValueError(f'{relative}: expected Rightmove REGION {region} ({name})')


def retained_observation(location_id):
    """Return checked raw stock totals and hashes from a retained supported release."""
    if location_id not in LOCATIONS:
        mappings = {row['location_id']: row for row in read(NEW_MAPPINGS)}
        mapping = mappings.get(location_id)
        if not mapping:
            return None
        manifest = load(NEW_RELEASE)
        resolver_relative = f'market-stock/resolver/{location_id}.json'
        matches = json.loads((NEW_RELEASE / resolver_relative).read_text(encoding='utf-8')).get('matches', [])
        if not any(str(item.get('id')) == mapping['portal_region_id'] and
                   item.get('type') == 'REGION' and item.get('displayName') == mapping['portal_region_name']
                   for item in matches):
            raise ValueError(f'{resolver_relative}: reviewed Rightmove REGION did not reproduce')
        counts, hashes = {}, [manifest[resolver_relative]['sha256']]
        for tenure in ('sale', 'rent'):
            relative = f'market-stock/search/{location_id}-{tenure}.html'
            if relative not in manifest:
                raise ValueError(f'Manifest lacks {relative}')
            found = RESULT_COUNT.findall((NEW_RELEASE / relative).read_text(encoding='utf-8'))
            if len(found) != 1:
                raise ValueError(f'{relative}: expected exactly one resultCount, found {len(found)}')
            counts[tenure] = int(found[0])
            hashes.append(manifest[relative]['sha256'])
        return dict(sale=counts['sale'], rent=counts['rent'],
                    portal_regions=f"REGION^{mapping['portal_region_id']} {mapping['portal_region_name']}",
                    capture_hashes=';'.join(hashes))
    manifest = load(RELEASE)
    sale_total = rent_total = 0
    component_names, hashes = [], []
    for component, region, name in LOCATIONS[location_id]:
        verify_resolver(manifest, component, region, name)
        resolver = component.replace('bournemouth-poole-bournemouth', 'bournemouth').replace('bournemouth-poole-poole', 'poole').replace('brighton-hove', 'brighton')
        sale, sale_meta = count(manifest, component, 'sale')
        rent, rent_meta = count(manifest, component, 'rent')
        sale_total += sale
        rent_total += rent
        component_names.append(f'REGION^{region} {name}')
        hashes.extend((manifest[f'market-stock/resolver/{resolver}.json']['sha256'], sale_meta['sha256'], rent_meta['sha256']))
    return dict(sale=sale_total, rent=rent_total, portal_regions='; '.join(component_names),
                capture_hashes=';'.join(hashes))


def replace_counts(rows, values, field):
    result = []
    for row in rows:
        if row['location_id'] in values:
            row = dict(row)
            row['oneBedCount'] = str(values[row['location_id']])
        result.append(row)
    return result


def main():
    sales, rents, audit = {}, {}, []
    for location_id, components in LOCATIONS.items():
        observation = retained_observation(location_id)
        sales[location_id], rents[location_id] = observation['sale'], observation['rent']
        composite_note = (' Bournemouth–Poole is the sum of two separately captured named portal regions; their proprietary boundaries may overlap or omit parts of the broad comparison geography.' if len(components) > 1 else '')
        audit.append(dict(location_id=location_id, sale_count=observation['sale'], rent_count=observation['rent'],
            portal_regions=observation['portal_regions'], capture_hashes=observation['capture_hashes'], note='Headline counts are not deduplicated.' + composite_note))
    buy = replace_counts(read(ROOT / 'data/inputs/buy.csv'), sales, 'buy')
    rent = replace_counts(read(ROOT / 'data/inputs/rent.csv'), rents, 'rent')
    market = [row for row in read(ROOT / 'data/inputs/market.csv') if row['location_id'] not in LOCATIONS]
    market += [dict(location_id=location_id, reason=(
        f"Rightmove's controlled 7 September 2026 filtered capture returned {sales[location_id]} sale and {rents[location_id]} rental results; these are headline counts, not deduplicated properties, and the query does not verify tower stock." +
        (' Bournemouth–Poole sums separate Bournemouth and Poole portal regions; their proprietary boundaries may overlap or omit parts of the broad comparison geography.' if len(components) > 1 else '')
    )) for location_id, components in LOCATIONS.items()]
    write_csv(ROOT / 'data/inputs/buy.csv', buy, tuple(buy[0]))
    write_csv(ROOT / 'data/inputs/rent.csv', rent, tuple(rent[0]))
    write_csv(ROOT / 'data/inputs/market.csv', market, ('location_id', 'reason'))
    sources = [row for row in read(ROOT / 'data/inputs/sources.csv')
               if not (row['location_id'] in LOCATIONS and row['topic'] == 'market')]
    for location_id, components in LOCATIONS.items():
        for component, _, _ in components:
            resolver = component.replace('bournemouth-poole-bournemouth', 'bournemouth').replace('bournemouth-poole-poole', 'poole').replace('brighton-hove', 'brighton')
            sources.append(dict(location_id=location_id, topic='market',
                url=load(RELEASE)[f'market-stock/resolver/{resolver}.json']['original_url']))
            for tenure in ('sale', 'rent'):
                sources.append(dict(location_id=location_id, topic='market',
                    url=load(RELEASE)[f'market-stock/search/{component}-{tenure}.html']['original_url']))
    write_csv(ROOT / 'data/inputs/sources.csv', sources, ('location_id', 'topic', 'url'))
    write_csv(ROOT / 'data/staging/2026-09-07-location-expansion-market-stock-audit.csv', audit,
              ('location_id', 'sale_count', 'rent_count', 'portal_regions', 'capture_hashes', 'note'))
    print(f'Prepared market stock for {len(audit)} expansion locations.')


if __name__ == '__main__':
    main()
