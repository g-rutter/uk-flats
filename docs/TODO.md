# Next work

## Priority: replace crime data (in progress)

Implemented first acquisition/calculation pass; see [crime research](crime-replacement.md).

- [x] Investigate official LA-scale evidence and select CSP geography, retaining
  codes, combined/split-LA exceptions and unknown boundary vintage explicitly.
- [x] Preserve fresh ONS March 2026 workbooks, source hashes and acquisition script.
- [x] Extract violence and sexual-offence counts with matched mid-2024 population
  for all 63 places; calculate separate research rates for April 2025–March 2026.
- [x] Reconcile calculations to published rates, quantify force unallocated totals,
  inspect extremes, and distinguish ONS coverage from the Police.uk Manchester gap.
- [ ] Acquire compatible local ASB counts. Inspected ONS appendix tables contain
  national ASB totals only; all local ASB values remain unknown.
- [ ] Verify boundary vintage and monthly completeness; resolve material unallocated
  totals (especially Humberside and Gloucestershire) and investigate outliers.
- [ ] Review comparability before displaying crime measures. Research CSV is
  available, but browser safety remains pending and combined rankings absent.

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

## Expand location list

Work with the user to check if more locations can and should be added within Wales and England.
If so, the data will need to be collected for these.