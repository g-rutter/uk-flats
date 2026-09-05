# Crime replacement research — 5 September 2026

The acquisition and first calculation pass are implemented. **Safety remains
pending**: the new figures are research outputs, excluded from the browser and
any rankings. All 63 locations remain in scope. This is fresh evidence, separate
from the unchanged historical one-mile counts.

## Source decision and common window

Use Community Safety Partnerships (CSPs), investigating the official LA-scale
route before smaller areas. The [ONS Police Force Area data tables](https://www.ons.gov.uk/peoplepopulationandcommunity/crimeandjustice/datasets/policeforceareadatatables),
YE March 2026 edition, supply CSP counts (C2), population and published rates (C4),
and combined/split LA mappings (C1). The common numerator window is **1 April 2025
to 31 March 2026**. C4 supplies **mid-2024 resident population rounded to 100**.
This provides a matched denominator without trying to recover population from
rounded rates or dividing the old radius counts by LA population.

Both source workbooks were downloaded on 5 September 2026. Raw bytes, source URLs,
retrieval dates and SHA-256 hashes are in `data/raw/crime/2026-09-05/`. Retrieval
was by curl for this initial snapshot; `scripts/acquire_crime.py` reproduces the
same HTTP downloads with urllib and records actual UTC retrieval times for future
snapshots. It refuses to overwrite an existing directory. An upstream revision
may change the bytes: retain the pinned snapshot for exact offline reproduction.

## Geography and category definitions

`crime_geographies.csv` maps each location to an explicit CSP code/name and LA
code, with a reason. The main mapping uses the existing canonical LA name and
C2's LA identity; it is not an independent settlement-boundary verification.
The workbook does not state an exact boundary vintage, so that field remains
blank. The source edition is recorded separately and is not a claimed vintage.

- Merthyr Tydfil uses **Cwm Taf**, including Rhondda Cynon Taf.
- Worcester uses **South Worcester**, including Malvern Hills and Wychavon.
- Kettering and Northampton use their named CSPs, which are parts of current North
  and West Northamptonshire respectively. Their C4 CSP populations are used.
- Other places use the matched CSP as an area proxy, not a claim about the town
  centre or every part of the named settlement. Shrewsbury, for example, uses
  Shropshire.

Keep **violence against the person** and **sexual offences** separate. Violence
uses the C2 headline group, including its homicide, unlawful-driving, injury,
non-injury and stalking/harassment components; do not add those components again.
Sexual offences use the separate C2 headline group. Neither is the previous
Police.uk combined street-level category. Counts measure recorded offences, not
victims or a person's probability of victimisation. No combined crime score is
calculated. ASB is an incident measure and must remain separate from offences.

## ASB finding and reporting gaps

The matching [ONS appendix workbook](https://www.ons.gov.uk/peoplepopulationandcommunity/crimeandjustice/datasets/crimeinenglandandwalesappendixtables)
was inspected and retained. Tables D4/D5 provide national ASB totals/categories,
not compatible CSP numerators. No local ASB counts were acquired in this pass;
all ASB counts and rates remain blank with a reason. A search result suggesting
CSP-level ASB publication was not corroborated by the downloaded tables and is
not used as evidence of availability.

[Police.uk's changelog](https://data.police.uk/changelog/) inspected on 5 September
2026 still reports Greater Manchester data unavailable and British Transport
Police ASB absent from April 2016 onwards, alongside month/force-specific gaps.
A street-level fallback needs its own 12-month force-coverage audit and verified
LSOA-to-geography lookup. No partial-month annualisation or imputation is allowed.
The Police.uk gap does **not** imply that ONS CSP crime is absent: C2 has numeric
violence and sexual-offence totals for Bolton, Manchester, Salford, Stockport and
Wigan. These are a different supply of data.

CSP notes identify unassigned offences, airport exclusions and specific Kent IT
issues. None of the current places is one of the listed Kent areas. The Derbyshire
note concerns the previous YE March 2025 period; it is not silently applied to
this window. Published annual totals are not proof of independent monthly
completeness. That check remains outstanding.

## Calculation and initial QA

`build.py` calculates each available rate as `count / matched CSP population *
1000`, rounded to three decimal places. Because published populations are rounded
to 100, these are approximate recalculations. Every available rate is checked
against C4 within the interval implied by population ±50; it is not expected to
match the cached ONS rate at full precision. Numerators, denominators, both rates,
source cell references, source hash, evidence ID, periods and geography remain in
CSV. Missing values never become zero.

For each category, also retain `force_count - sum(named CSP counts)` and its
percentage of the force total. This residual includes unassigned/airport records;
it is not a count of unreported crime and must not be allocated pro rata to CSPs.
It is repeated for places sharing a force and must not be summed across places.

Initial review of the pinned snapshot:

| Check | Finding |
| --- | --- |
| Source mapping | All 63 places have matched C2/C4 CSP observations for both offence groups |
| Rate reconciliation | All 126 calculations pass the population-rounding interval check |
| Violence range | 20.938 (Shropshire proxy for Shrewsbury) to 68.994 (Blackpool) per 1,000 |
| Sexual-offence range | 2.605 (Shropshire) to 6.859 (Blackpool) per 1,000 |
| Humberside residual | 9.349% violence; 9.163% sexual offences outside named CSP totals |
| Gloucestershire residual | 2.943% violence; 14.267% sexual offences outside named CSP totals |
| Other notable sexual-offence residuals | South Yorkshire 6.819%; Cambridgeshire 6.090% |

`data/derived/crime_residual_audit.csv` provides the reproducible force/category
review table. It deduplicates repeated force totals across locations, preserves
the source cells and evidence, and marks residuals at or above 5% as material.
The threshold is a review trigger rather than a statistical correction: residual
offences remain outside named CSP totals and are not distributed to locations.

`data/derived/crime_outlier_audit.csv` lists the three lowest and highest
available calculated rates in each offence category. It retains the underlying
counts, population, geography, force residual and source evidence so the
extremes can be checked against boundary, completeness and recording context.
The list is a deterministic QA queue; it is not a safety classification, score
or ranking input.

The extremes were checked for category, denominator and source-cell alignment,
not independently explained. Rural/combined geographies and visitor-heavy areas
are not like-for-like town comparisons. Resident population excludes commuters
and visitors, while their recorded incidents can enter the numerator. Recording
practices and reporting also vary. These findings justify withholding safety
presentation until the coverage and boundary review is resolved; a low rate is
not evidence that missing reporting makes an area safe.

## Reproduction and remaining work

### Follow-up: reproducible ASB fallback coverage audit

`data/derived/crime_coverage.csv` now covers April 2025–March 2026 for every
force represented in the offence observations, plus British Transport Police
as a cross-cutting provider. It is a notice audit, not an ASB numerator or a
certificate of complete reporting. It does not change the ONS coverage claims.

The pinned `data/raw/crime/coverage-2026-09-05/` snapshot retains the Police.uk
changelog and availability JSON with individual URLs, UTC retrieval timestamps
and hashes. Initial acquisition used curl; timestamps come from each completed
download's file modification time. Python urllib acquisition was attempted but
failed with local network/TLS errors. `scripts/acquire_crime_coverage.py` provides
the standard-library acquisition path for environments with working HTTPS.
The original ONS snapshot remains unchanged.

The [availability API documentation](https://data.police.uk/docs/method/crimes-street-dates/)
defines its force lists as stop-and-search availability. The audit uses only its
dataset dates; it never interprets those lists as crime or ASB coverage.

The [changelog](https://data.police.uk/changelog/) contains both missing submissions
and subsequent refreshes. The generated audit retains same-month notices,
ongoing known issues, and all later crime notices for each force. Later notices
are candidates for manual review, not automatic proof that a specific gap was
filled. In particular, Gwent's March 2026 missing submission has a later May
notice of refreshed crime data covering September 2025–April 2026. British
Transport Police's ASB omission since April 2016 remains a separate known issue.
Silence in the changelog is unknown coverage, never a complete month. No counts
are annualised, filled with zero or inferred from a notice.

The [Home Office open-data guide](https://www.gov.uk/government/statistics/police-recorded-crime-open-data-tables/police-recorded-crime-and-outcomes-open-data-tables-user-guide)
describes CSP offence counts by financial quarter. These offer a further annual
reconciliation route, but quarterly rows alone cannot verify monthly completeness
and are not compatible local ASB counts. Acquisition of those tables and the
boundary reference remains outstanding.

Build validates snapshot hashes and generates the audit offline. Its forces are
derived from canonical offence observations, so additional mapped locations
flow through without a fixed location count. A location without observations
continues to have unknown crime research values; it creates no invented force.

```sh
python3 scripts/acquire_crime_coverage.py data/raw/crime/new-coverage-snapshot
```

New snapshots require review before changing the pinned path in
`scripts/crime_coverage.py`. Next: inspect actual ASB files and boundary lookups,
reconcile refreshes, and decide explicitly how to report incomplete force coverage.

```sh
# Optional fresh acquisition into a NEW directory (network required):
python3 scripts/acquire_crime.py data/raw/crime/new-snapshot
# Recreate observations from the pinned snapshot (offline):
python3 scripts/prepare_crime.py
python3 scripts/build.py
python3 -m unittest discover -s tests
```

The preparer is deliberately pinned to inspected March 2026 headers and periods;
a later edition needs a reviewed adapter. It updates `crime_observations.csv` from
the editable geography mapping. The build exports source tables and
`data/derived/crime_research.csv`; these must not be hand-edited. New locations
without mappings/observations remain present with unknown values.

Remaining: acquire a compatible ASB numerator or establish a documented
force/month-aware fallback; confirm boundary vintage; audit monthly completeness
and material unallocated totals; investigate outliers and recording differences.
Only after that review should crime measures enter the browser. Combined rankings
remain absent, and completing crime research will not by itself authorise them.

## Follow-up: dated geography relationship audit

The [ONS April 2025 LA-to-CSP-to-PFA lookup](https://www.data.gov.uk/dataset/1878dff0-fede-48f3-b011-3ca826714469/local-authority-district-to-community-safety-partnership-to-pfa-april-2025-lookup-in-ew)
is now pinned in `data/raw/crime/boundaries-2026-09-05/`, alongside its ArcGIS item
metadata and Police.uk download/about pages. The lookup describes relationships
as at **1 April 2025**. This date belongs to the lookup; it does not establish the
boundary vintage of the crime workbook or its population denominator.

`build.py` generates `data/derived/crime_boundary_audit.csv` for every location:

- 59 have agreeing LA/CSP/force codes with no split-LA relationship identified.
  This does not verify their boundary footprints or LSOA membership.
- Barnsley and Sheffield retain workbook-mapping LA codes E08000016/E08000019,
  whereas the lookup uses E08000038/E08000039 for the same CSP codes.
  [ONS identifies Barnsley's replacement as a 2025 boundary change](https://www.ons.gov.uk/explore-local-statistics/areas/E08000038-barnsley);
  [ONS also records both code changes](https://www.ons.gov.uk/explore-local-statistics/indicators/cigarette-smokers).
  Do not simply relabel the crime denominator: reconcile its footprint first.
- Kettering and Northampton have valid LA/CSP pairs, but their LAs map to several
  CSPs. A current-LA join would multiply or misassign ASB rows. A finer verified
  membership lookup is required. Combined CSP member LAs are also retained,
  including Cwm Taf and South Worcester.

Canonical mappings and offence values are unchanged. All audit rows explicitly
retain unverified boundary compatibility and `lsoa_to_csp_ready=no`; no local ASB
counts are produced. New locations without mappings receive unknown audit values.
The loader rejects hash mismatches, truncated ArcGIS responses, missing identities
and duplicate LA/CSP pairs. The source is a relationship table, not polygon data.

The [Police.uk download page](https://data.police.uk/data/) explicitly identifies
**2021 LSOAs**. Its [about page](https://data.police.uk/about/) explains that these
refer to anonymised points and flags possible duplication of some ASB uploads.
Repeated rows cannot safely be deduplicated by Crime ID: ASB offence references
are blank in the submitted data. These issues need review in addition to the
month/force notices; file presence alone will not certify comparable reporting.

On 5 September 2026 the following custom-download request returned HTTP 403 both
inside and outside the sandbox, before any ZIP or ASB records were obtained:

```sh
curl -L --fail --max-time 60 \
  --data 'date_from=2025-04&date_to=2026-03&forces=gwent&include_crime=on' \
  https://data.police.uk/data/ -o /tmp/uk-flats-police-request.html
```

Gwent was chosen to investigate the refreshed March gap, not as a location
shortlist. This failed request is not evidence that Gwent's submission is absent.
Next acquisition needs a working custom-download session or the published archive;
retain all force/month files and inspect refreshes before calculating local totals.

To acquire a new geography snapshot:

```sh
python3 scripts/acquire_crime_boundaries.py data/raw/crime/new-boundary-snapshot
```

The initial snapshot used curl because urllib failed with DNS/TLS errors, including
after an outside-sandbox retry. Its manifest timestamps are the successful curl
downloads' file modification times in UTC; hashes cover the retained bytes.
The retry directory retains the two successful urllib geography downloads and
their manifest; the subsequent Police.uk request failed. This partial snapshot
is not used by the build.
The standard-library script records completion timestamps and refuses existing
directories. Review a new edition before changing the pinned build path.
