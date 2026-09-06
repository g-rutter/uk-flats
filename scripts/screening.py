"""Calculate the current broad-screen scores from canonical observations."""
from collections import defaultdict
import math


WEIGHTS = {
    'affordability': 15,
    'safety': 15,
    'local_transport': 15,
    'condition': 15,
    'quiet': 15,
    'stock': 15,
    'national_transport': 10,
}


def known(value):
    return value is not None and value != ''


def percentile_scores(rows, value, lower_is_better=True):
    """Return 1--5 quintile scores, giving tied values their mean rank."""
    ordered = sorted((row for row in rows if known(value(row))), key=value,
                     reverse=not lower_is_better)
    result, index = {}, 0
    total = len(ordered)
    while index < total:
        finish = index + 1
        while finish < total and value(ordered[finish]) == value(ordered[index]):
            finish += 1
        mean_rank = (index + 1 + finish) / 2
        percentile = (total - mean_rank + 1) / total
        score = max(1, min(5, math.ceil(percentile * 5)))
        for row in ordered[index:finish]:
            result[row['id']] = score
        index = finish
    return result


def affordability_scores(locations, tenure):
    field = 'proxyMedian' if tenure == 'buy' else 'proxyMonthly'
    ordered = sorted((row for row in locations if known(row[tenure].get(field))),
                     key=lambda row: row[tenure][field])
    result, total = {}, len(ordered)
    for index, row in enumerate(ordered):
        # The current comparison's lower, middle and upper thirds score 5, 3 and 1.
        result[row['id']] = 5 if index < total / 3 else 3 if index < total * 2 / 3 else 1
    return result


def stock_score(count):
    if not known(count):
        return None
    return 1 if count < 10 else 2 if count < 25 else 3 if count < 75 else 4 if count < 250 else 5


def local_transport_score(reason):
    if not reason:
        return None
    text = reason.lower()
    return 5 if 'dense multimodal' in text else 4 if 'useful town/city' in text else 3 if 'basic bus and rail' in text else None


def condition_score(reason):
    if not reason:
        return None
    text = reason.lower()
    if 'highest condition score' in text or 'highest broad condition' in text:
        return 5
    return 4 if 'favourable' in text or 'broadly pleasant' in text else 2


def quiet_score(reason):
    if not reason:
        return None
    text = reason.lower()
    severe = ('persistent noise', 'widespread noise', 'comparatively scarce',
              'relatively difficult', 'substantial persistent', 'unusually dense')
    calmer = ('lower-intensity', 'quieter fabric', 'calmer areas', 'rural edge',
              'no urban motorway', 'smaller town has substantial quieter')
    if any(term in text for term in severe):
        return 2
    return 4 if any(term in text for term in calmer) else 3


def route_score(minutes, changes):
    if not known(minutes) or not known(changes):
        return None
    effective = minutes + 15 * changes
    return 5 if effective <= 75 else 4 if effective <= 120 else 3 if effective <= 165 else 2 if effective <= 210 else 1


def national_transport_score(row):
    london = route_score(row.get('londonMinutes'), row.get('londonChanges'))
    birmingham = route_score(row.get('birminghamMinutes'), row.get('birminghamChanges'))
    if london is None or birmingham is None:
        return None
    return round((london + birmingham) / 2, 1)


def weighted_score(factors):
    if any(value is None for value in factors.values()):
        return None
    return round(sum(WEIGHTS[name] * value / 5 for name, value in factors.items()), 1)


def assign_score_bands(results, tenure):
    """Assign near-equal score thirds without splitting locations tied on score."""
    grouped = defaultdict(list)
    for location_id, result in results.items():
        score = result['tenures'][tenure]['score']
        if score is not None:
            grouped[score].append(location_id)
        else:
            result['tenures'][tenure]['band'] = 'unknown'
    ordered = sorted(grouped.items())
    total, rank = sum(len(ids) for _, ids in ordered), 0
    bands = {band: {'count': 0, 'minimum': None, 'maximum': None}
             for band in ('low', 'mid', 'high')}
    for score, location_ids in ordered:
        finish = rank + len(location_ids)
        mean_rank = (rank + 1 + finish) / 2
        band = 'low' if mean_rank <= total / 3 else 'mid' if mean_rank <= total * 2 / 3 else 'high'
        for location_id in location_ids:
            results[location_id]['tenures'][tenure]['band'] = band
        bands[band]['count'] += len(location_ids)
        if bands[band]['minimum'] is None:
            bands[band]['minimum'] = score
        bands[band]['maximum'] = score
        rank = finish
    bands['unknown'] = sum(1 for result in results.values()
                           if result['tenures'][tenure]['band'] == 'unknown')
    return bands


def compile_screening(locations, crime):
    """Return score metadata and per-location values; never use legacy scores."""
    violence = {row['location_id']: row['rate_per_1000'] for row in crime
                if row['category'] == 'violence_against_person' and known(row['rate_per_1000'])}
    sexual = {row['location_id']: row['rate_per_1000'] for row in crime
              if row['category'] == 'sexual_offences' and known(row['rate_per_1000'])}
    safety_rows = [row for row in locations if row['id'] in violence and row['id'] in sexual]
    violence_scores = percentile_scores(safety_rows, lambda row: violence[row['id']])
    sexual_scores = percentile_scores(safety_rows, lambda row: sexual[row['id']])
    safety = {row['id']: round((violence_scores[row['id']] + sexual_scores[row['id']]) / 2, 1)
              for row in safety_rows}
    affordability = {tenure: affordability_scores(locations, tenure) for tenure in ('buy', 'rent')}
    results = {}
    for row in locations:
        common = {
            'safety': safety.get(row['id']),
            'local_transport': local_transport_score(row['localTransport'].get('reason')),
            'condition': condition_score(row['condition'].get('reason')),
            'quiet': quiet_score(row['quiet'].get('reason')),
            'national_transport': national_transport_score(row['nationalTransport']),
        }
        results[row['id']] = {'safety': common['safety'], 'tenures': {}}
        for tenure in ('buy', 'rent'):
            factors = dict(common, affordability=affordability[tenure].get(row['id']),
                           stock=stock_score(row[tenure].get('oneBedCount')))
            results[row['id']]['tenures'][tenure] = dict(factors=factors, score=weighted_score(factors))
    score_bands = {tenure: assign_score_bands(results, tenure) for tenure in ('buy', 'rent')}
    return {
        'title': 'Broad screening score',
        'weights': WEIGHTS,
        'safety_label': 'Recorded-offence safety proxy',
        'safety_note': 'Equal-weighted quintile scores for ONS CSP violence-against-the-person and sexual-offence rates; lower recorded rates score higher. ASB is excluded pending coverage review.',
        'score_bands': score_bands,
        'results': results,
    }
