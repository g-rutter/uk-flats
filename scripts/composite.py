"""Calculate the current broad-screen scores from canonical observations."""
from collections import defaultdict
import math


WEIGHTS = {
    'housing_cost': 15,
    'safety': 15,
    'local_transport': 15,
    'residential_environment': 15,
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


def housing_cost_scores(locations, tenure):
    field = 'proxyMedian' if tenure == 'buy' else 'proxyMonthly'
    return percentile_scores(locations, lambda row: row[tenure].get(field),
                             lower_is_better=True)


def housing_cost_bands(locations, tenure, scores):
    """Describe the observed price range in each generated housing-cost quintile."""
    field = 'proxyMedian' if tenure == 'buy' else 'proxyMonthly'
    bands = {}
    for score in range(5, 0, -1):
        values = sorted(row[tenure][field] for row in locations
                        if scores.get(row['id']) == score)
        bands[str(score)] = {
            'count': len(values),
            'minimum': values[0] if values else None,
            'maximum': values[-1] if values else None,
        }
    return bands


def stock_score(count):
    if not known(count):
        return None
    return 1 if count < 10 else 2 if count < 25 else 3 if count < 75 else 4 if count < 250 else 5


def supplied_score(row):
    value = row.get('score')
    return value if known(value) else None


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
    total_weight = sum(WEIGHTS[name] for name in factors)
    return round(100 * sum(WEIGHTS[name] * value / 5 for name, value in factors.items())
                 / total_weight, 1)


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


def compile_composite(locations, crime):
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
    housing_cost = {tenure: housing_cost_scores(locations, tenure) for tenure in ('buy', 'rent')}
    housing_cost_band_metadata = {
        tenure: housing_cost_bands(locations, tenure, housing_cost[tenure])
        for tenure in ('buy', 'rent')
    }
    results = {}
    for row in locations:
        common = {
            'safety': safety.get(row['id']),
            'local_transport': supplied_score(row['localTransport']),
            'residential_environment': supplied_score(row['residentialEnvironment']),
            'national_transport': national_transport_score(row['nationalTransport']),
        }
        results[row['id']] = {'safety': common['safety'], 'tenures': {}}
        for tenure in ('buy', 'rent'):
            factors = dict(common, housing_cost=housing_cost[tenure].get(row['id']),
                           stock=stock_score(row[tenure].get('oneBedCount')))
            results[row['id']]['tenures'][tenure] = dict(factors=factors, score=weighted_score(factors))
    score_bands = {tenure: assign_score_bands(results, tenure) for tenure in ('buy', 'rent')}
    return {
        'title': 'Broad composite score',
        'weights': WEIGHTS,
        'safety_label': 'Recorded-offence safety proxy',
        'safety_note': 'Equal-weighted quintile scores for ONS CSP violence-against-the-person and sexual-offence rates; lower recorded rates score higher. ASB is excluded pending coverage review.',
        'housing_cost_bands': housing_cost_band_metadata,
        'score_bands': score_bands,
        'results': results,
    }
