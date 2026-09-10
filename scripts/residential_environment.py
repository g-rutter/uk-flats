"""Shared residential-environment scoring helpers."""


METHOD_VERSION = 'residential-environment-bua24-v3-country-calibrated'
BOUNDARY_RULE = 'A value equal to a threshold enters the higher score band.'


def score_for(value, cutpoints):
    return 1 + sum(value >= threshold for threshold in cutpoints)


def percentile_for(value, observations, lower_is_better=False):
    """Population-weighted percentile; ties receive the same inclusive result."""
    total = sum(population for _, population in observations)
    if total <= 0:
        raise ValueError('National reference population is empty')
    if lower_is_better:
        weight = sum(population for candidate, population in observations if candidate >= value)
    else:
        weight = sum(population for candidate, population in observations if candidate <= value)
    return 100 * weight / total


def weighted_cutpoints(observations):
    ordered = sorted(observations)
    total = sum(population for _, population in ordered)
    cutpoints, cumulative, target = [], 0, 1
    for value, population in ordered:
        cumulative += population
        while target <= 4 and cumulative >= total * target / 5:
            cutpoints.append(value)
            target += 1
    if len(cutpoints) != 4:
        raise ValueError('Could not derive four national quintile thresholds')
    return cutpoints
