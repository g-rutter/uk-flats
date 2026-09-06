# Crime replacement

Status: reviewed ONS CSP offence rates are displayed separately and supply the
limited recorded-offence safety proxy in the broad composite score. ASB is
research-only.

## Selected path

Use Police.uk ASB records for PFA/CSP aggregation, with a reusable archive-and-
lookup pipeline. This is the chosen replacement path for new locations and time
periods.

1. Acquire a dated Police.uk archive with `scripts/acquire_police_archive.py`.
2. Acquire dated ONS LSOA-to-LAD and LA-to-CSP lookups.
3. Run `scripts/aggregate_asb.py` with `--start` and `--end`.
4. Review force/month coverage, unmapped LSOAs, split LAs and refresh notices.
5. Add reviewed results to canonical inputs only after the review gates pass.

The aggregator never assigns split-LA records, fills missing months, annualises,
imputes, deduplicates ASB by Crime ID or changes unknowns to zero. New locations
need a canonical location and reviewed PFA/CSP mapping; periods are parameters.

Police.uk locations are anonymised and submissions can be incomplete. ASB is an
incident measure, not an offence or victimisation probability. PFA values are
coarse context; CSP aggregation is preferred where the lookup supports it. See
[Police.uk data notes](https://data.police.uk/about/).

## ONS offence measures

The retained ONS March 2026 workbook supplies CSP violence and sexual-offence
counts with matched mid-2024 populations for April 2025–March 2026. Rates are
`count / CSP population * 1,000`, rounded to three decimals. The browser retains
the categories separately and derives its limited safety proxy from equally
weighted fresh quintile bands, with lower recorded rates scoring higher. This is
not a measure of victimisation risk or personal safety; see the methodology.

## Current checkpoint

`data/raw/crime/2026-09-05/` contains the ONS workbooks, dated ONS relationship
and Police.uk coverage snapshots, the March 2026 Police.uk archive, and the
LSOA-to-LAD lookup. The archive is 1.6 GB and is retained for research. No ASB
values have been added to `data/inputs/crime_observations.csv`.

The ONS pass covers all 63 locations after reconciling Barnsley and Sheffield 2025
LA codes. Kettering and Northampton use their directly named CSP rows and matching
CSP populations, rather than an ambiguous whole-LA allocation. The residual and
outlier review supports displaying the two ONS rates separately, as documented in
[the review decision](crime-review.md). The completed ASB research output records
853,367 assigned records and 96,558 unmapped or split records, with force/month
completeness still unknown; ASB remains excluded.
