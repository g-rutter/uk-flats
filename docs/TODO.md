# Next work

## Priority: replace crime data (not implemented)

- Choose a scalable common geography for the broad comparison, favouring a
  geography with official population estimates and comparable crime coverage.
  Investigate local-authority-level evidence before attempting smaller areas.
- Find compatible violence/sexual-offence and ASB numerators plus population
  denominators. Record boundary codes/vintage and population reference period.
  Do not divide the old one-mile counts by whole-town or LA population.
- Establish one common 12-month window, category definitions and completeness
  checks; document force gaps, especially the inherited Greater Manchester gap.
  Missing reporting must remain unknown rather than appear unusually safe.
- Calculate each category separately as count / matched population * 1,000, with
  numerator, denominator, geography, dates, coverage, URLs and transformation in CSV.
  Resident-population rates still reflect visitor/commuter activity and reporting;
  they must not be presented as a person's probability of victimisation.
- Review comparability and plausible outliers before displaying safety or proposing
  any combined ranking. This is a future research design, not a verified source plan.

## Reproducibility and evidence quality

- Recover or recreate original acquisition scripts and raw snapshots for prices,
  rents and counts; first check whether missing checkpoints can be recovered.
- Audit workbook versus JS values and source claims before treating them as verified.
- Add explicit geography codes and per-observation evidence IDs for mixed-period
  updates; do not conflate HMLR town, LA, portal region and centroid geographies.
- Review coarse transport/quiet/condition judgements; preserve uncertainty and avoid
  interpreting deprivation as appearance or upkeep.

## Interactive map

- Make a proper interactive map like the original available in the current explorer.
  Use `data/archive/UK flats (attempt 2)/uk-flat-stage1-visualisation/` as reference:
  selectable location markers, hover/focus details, buy/rent switching, filters and
  a linked evidence panel. Drive it from the current generated data and preserve
  the broad-only scope with safety pending and no combined rankings.
- Check the map in a browser, including keyboard interaction and mobile layout.
  The current table view has been statically checked, not manually browser-tested.

No shortlist, property sampling or neighbourhood drill-down is planned.
