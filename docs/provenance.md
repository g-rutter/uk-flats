# Provenance and CSV schema

Recurring acronyms in this document are JavaScript (JS), Office for National
Statistics (ONS), Department for Transport (DfT), Output Area (OA), Built-up Area (BUA),
Energy Performance Certificate (EPC), Community Safety Partnership (CSP),
Police Force Area (PFA), local authority (LA), Geographic Information System
(GIS) and anti-social behaviour (ASB). A BUA represents the physical footprint
of a continuously built-up settlement rather than a council or other
administrative boundary.

## What survived

The untouched `data/archive/UK flats (attempt 2)/` directory is the historical
source. `data/archive/manifest.csv` records every file's path and SHA-256 hash.
This identifies imported artifacts, not the validity of upstream claims. Dates
such as 2026-09-05 are inherited, not newly retrieved.

`extract_legacy.py` reads the old `locations.js` JSON without executing JavaScript
and exports CSV tables to `data/archive/locations/`. All location fields, including
old scores and crime, survive there. UI metadata is in `metadata.json`; each XLSX
worksheet is exported to `data/archive/workbook/` with rankings and QA notes.
Exports preserve cell values and positions, not formatting. Cached formula results
are preferred; otherwise the formula is retained. The XLSX remains authoritative
for formatting and formulas.

The workbook mentions unavailable checkpoint JSONs, `affordability.json` and other
intermediates. No raw transaction downloads, API responses, portal captures or
calculation scripts were supplied. Historical QA claims are not verified here.
Workbook and JS are separate snapshots; active inputs come from JS without claiming
they reconcile to every workbook cell.

## Canonical inputs

CSV encoding is UTF-8, comma separated, with a header row and LF line endings.
Blank numeric cells mean unknown; zero is an actual recorded zero. Identifiers are
stable strings. Numeric counts/minutes/GBP are whole numbers; coordinates are
signed decimal degrees. Original camelCase names are retained for traceability.

| File | Key and contents | Historical source context |
| --- | --- | --- |
| locations.csv | `id`; name, country, localAuthority, lat, lon | JS top-level identity; GC01/GC02 |
| population.csv | `location_id`; Census usual residents, date, retrieval, evidence, reviewed BUA geography, method, confidence and reason | Reproducible Census 2021 TS001 OA counts aggregated through the official April 2024 OA-to-BUA best-fit lookup |
| buy.csv | `location_id`; proxyMedian (GBP), transactions, oneBedCount, housingCostConfidence/Reason | JS buy; HC-BUY-PPD-2024-26; counts use MT-RM-SEARCH-20260905 |
| rent.csv | `location_id`; proxyMonthly (GBP/month), oneBedCount, housingCostConfidence/Reason | JS rent; HC-RENT-PIPR-2026-07; counts use MT-RM-SEARCH-20260905 |
| market.csv | `location_id`; reason | JS market; MT-RM-SEARCH-20260905 / MT-RM-LOS-20260905 |
| localTransport.csv | `location_id`; DfT 0--100 connectivity, national population percentile, score, source period/date/evidence, BUA geography, covered/expected population, method, confidence and reason | Reproducible DfT 2025 OA metric aggregated to reviewed BUAs |
| location_geographies.csv | `location_id`; reviewed BUA mapping type/name/vintage, basis, confidence and reason | One mapping decision for every screen location |
| location_geography_components.csv | `location_id`, BUA code and name | One row per component; makes Bournemouth--Poole and Torbay composites explicit |
| local_transport_release.csv | release/method IDs, exact source field, population/geography vintages, national population/OA count, range, quintile thresholds and boundary rule | Versioned national reference distribution for local transport |
| nationalTransport.csv | `location_id`; londonMinutes/Changes, birminghamMinutes/Changes, confidence and reason | JS nationalTransport; TR01 and per-location transport links |
| transport_stations.csv | `location_id`; reviewed origin CRS, name, rationale, confidence and evidence IDs | National-transport acquisition workstream; contains reviewed mappings for the 83 locations present in its accepted release; newer locations remain blank |
| transport_route_observations.csv | one review-only, manually transcribed route observation per location/destination, with planner query, timed itinerary and capture reference | National-transport acquisition workstream; not a canonical replacement until a complete release is approved |
| residential_environment.csv | `location_id`; four raw pillar observations and percentiles, combined index/national percentile/score, separate periods and evidence IDs, BUA components, per-pillar covered population, expected population, method, confidence and reason | Live v3 factor input; quiet and EPC percentiles are calibrated within country |
| residential_environment_release.csv | release/method IDs, national reference count/population and quintile thresholds, equality rule, weights, compatibility transforms, air fallback count and OS Open Greenspace geometry/coverage audit | Versioned `residential-environment-bua24-v3-country-calibrated` national reference and preparation controls |
| digital_connectivity.csv | `location_id`; gigabit availability percentage, residential/matched/available premise counts, source and expected OA-row counts, period/date/evidence, BUA geography, method, confidence and reason | Reproducible Ofcom January 2025 residential OA availability aggregated to reviewed BUAs; contextual and unscored |
| sources.csv | `location_id`, topic, url; multiple rows per location/topic | JS sources; original links, including archived crime context |
| evidence.csv | `id`; workstream, title, publisher, url, dataPeriod, retrievalDate, geography, coverage, limitations | JS evidence; inherited source-level metadata |

The topic-to-evidence mapping above documents the inherited common periods. Most
visitor links by location live in sources.csv; local transport and digital
connectivity resolve shared links through each row's `evidence_id`. Local transport and residential
environment use supplied integer scores that must reproduce from their versioned
national thresholds. Residential environment additionally requires its equal
four-pillar index, evidence IDs, periods and complete populations to reproduce.
Reasons remain explanatory and are never parsed to derive a score.
Crime references remain for provenance but are hidden from the active browser view.

Population is not inherited evidence. `prepare_population.py` verifies the hashes
of the retained Nomis Census 2021 TS001 ZIP and ONS OA-to-April-2024-BUA best-fit
lookup, sums usual residents for every reviewed BUA component, and requires every
current location to have complete positive coverage. The resulting settlement
count is contextual and does not enter the composite score.

Initial inputs remove `safety` and fields containing score, unknowns, weakness or
composite. Removed values remain archived. Active inputs are maintained separately;
archive extraction never overwrites them.

## Generated outputs and checks

`build.py` joins topic rows to identities by ID; missing topic rows become unknown.
It writes a flat dotted-column broad_screen.csv and the browser's JS data object.
It validates unique identities, topic foreign keys, duplicate topic rows, numeric
values and source URL schemes. For local transport it additionally validates
0--100/percentile bounds, 1--5 threshold agreement, evidence and method IDs,
complete positive population coverage, and complete reviewed geography mappings.
Digital connectivity additionally validates 0--100 bounds, premise-count order,
percentage reproduction, OA-row coverage bounds, evidence/method IDs and the
reviewed BUA components. It has no score field and is not read by `composite.py`.
It does not validate upstream statistical truth.
No row count is hard-coded. Generation contains no clock timestamps or network calls.

For future acquisitions, store dated raw snapshots with source URL/query, retrieval
date, observation period, units and geography identifiers, plus the transformation
script. Retain non-CSV artifacts and scripted CSV extractions. Add row-level
evidence IDs when multiple source periods enter one topic.

The national-transport workstream has a separate browser-UI source model. Its
station mapping and long-form route transcription are validated for columns,
foreign keys and duplicate keys by `build.py`, then validated in full against a
hashed raw release by `prepare_national_transport.py`. The preparer produces
staging output only; it cannot silently replace the historical
`nationalTransport.csv`. See [national transport methodology](national-transport-methodology.md).

The local-transport workstream is fully source-to-output reproducible.
`prepare_local_transport.py` verifies the dated release manifest and streams the
DfT ODS, selects only `Overall (public transport)`, joins the official 2021-OA to
April-2024-BUA best-fit lookup, weights by Census 2021 TS001 usual residents, and
writes a full review table plus the canonical input. The score uses national
population-weighted thresholds stored in `local_transport_release.csv`, not the
candidate distribution. See [local transport methodology](local-transport-methodology.md).

The digital-connectivity workstream is source-to-output reproducible and stays
outside the composite. `acquire_digital_connectivity.py` records the official
Ofcom OA archive and data dictionary in a new dated, hash-pinned release.
`prepare_digital_connectivity.py` reads the residential OA member, reuses the
hash-verified ONS OA-to-BUA lookup and reviewed BUA components, then sums Ofcom's
available-premise and total-premise counts. It writes a full review table and
the canonical `digital_connectivity.csv`. See the
[digital connectivity methodology](digital-connectivity-methodology.md).

The residential-environment workstream is source-to-output reproducible and its
canonical candidate table is a live build input. `acquire_residential_environment.py`
downloads official bulk sources and discovers the current GB-wide OS Open
Greenspace GeoPackage through the OS Downloads API. The retained 2026-09-09
environment manifest contains twelve hash-pinned artifacts, including the April
2026 product metadata and national geometry archive. The rejected ONS 2020
green-space workbook and its three 2011 allocation inputs were removed rather
than archived as supported inputs.

`prepare_residential_environment.py` verifies both the environment manifest and
the shared local-transport population/BUA release. It calculates green distance
and clipped provision from OA21 population-weighted origins in EPSG:27700,
aggregates all four pillars to every BUA, derives the combined national
distribution, and writes `residential_environment.csv`,
`residential_environment_release.csv` and the generated
`data/derived/residential_environment_bua_audit.csv`. It also writes
`data/derived/residential_environment_compatibility_audit.csv`, a candidate-level
migration audit comparing the former mixed-scale noise and EPC percentiles with
the selected country-calibrated method. `review_residential_environment.py`
generates the retained sensitivity, outlier, correlation and official
country-domain/boundary audits. The national audit
contains 7,070 complete reference BUAs; all four pillars cover the full expected
population of all 90 candidates. See [residential-environment methodology](residential-environment-methodology.md)
and the [compatibility review](residential-environment-compatibility.md).

## Release controls

`data/registry/location_registry.csv` is an intentionally empty, editable intake
register for future places. It is not a second location table: accepted rows must
identify all topic geographies and a retained lookup artifact in
`data/raw/releases/<release>/manifest.csv`; proposed rows instead state why a
mapping is missing. `scripts/prepare_locations.py` fail-closes on duplicate IDs,
unresolved mappings, absent release artifacts, bad checksums and out-of-scope
countries, and produces explicit review candidates rather than changing canonical
inputs by default.

Every new raw release has a `manifest.csv` with the columns documented in
`scripts/release_manifest.py`: relative artifact path, URL, complete request/query,
retrieval time, data period, SHA-256, MIME type, publisher, licence/terms and
coverage limitations. A release may additionally retain `byte_size`; when it is
present, the shared manifest loader verifies it before the SHA-256. The
environment release records this field for all twelve artifacts. `build.py`
verifies every environment artifact hash before consuming the live factor.

`scripts/release_audit.py`, run by `build.py`, writes
`data/derived/release_audit.csv`. It is one location/topic checklist row with
`ready`, `missing` or `review-required`. A non-crime observation without a
retained row-level raw artifact is `review-required`; an ONS crime observation is
`ready` when its retained workbook hash is present. Status is assigned by
location/topic evidence, not by a location cohort.

`data/registry/validation_probe.csv` predeclares a 12-place stratified method
probe. Its completed rent and buy result columns record the retained release
comparison without altering current canonical values.

## July 2026 price and rent method probe

The initial probe release is `data/raw/releases/2026-09-06-baseline-probe/`.
It uses the ONS PIPR workbook edition published 19 August 2026 and extracts its
July 2026 (`2026-07`) one-bedroom LA means. `prepare_rent.py` checks the
workbook layout, LA code and LA name, and emits a source-cell and SHA-256 audit
to ignored `data/staging/<release>/`. The twelve predeclared rent rows reproduce
the imported values exactly; that confirms the rent extraction rule only, not
the provenance of any other baseline row.

`validation_probe_mappings.csv` is the reviewed, explicit mapping sheet for the
probe only. It records the exact HMLR bulk Town/City/District values and ONS LA
codes; it does not make the legacy baseline a reviewed expansion registry.

`acquire_price_paid.py` retained the official 2024, 2025 and 2026 HMLR yearly
CSV files in that release, with their hashes and retrieval records. The 2024
and 2026 whole-year artifacts are filtered to the inclusive 2024-07-01 to
2026-06-30 window. `prepare_buy.py` accepts HMLR's 16-column bulk schema,
uses the reviewed exact uppercase Town/City or District keys, applies the
category-A and flat/maisonette filters offline, and retains selected values and
exclusions. The display value is a whole-pound median; an exact half-pound
midpoint rounds up. All twelve price medians and transaction counts match the
existing canonical values after that documented rounding rule. Together with the
already matching rent results, this validates the stated methods and mappings
for this sample only; it does not make untested baseline rows reproducible.

The three HMLR yearly CSVs exceed GitHub's per-file size limit and are therefore
not in Git. Their committed release-manifest rows retain the URLs, retrieval
times and SHA-256 values. After cloning, run
`python3 scripts/rehydrate_raw.py data/raw/releases/2026-09-06-baseline-probe`.
It downloads only missing artifacts and fails if their bytes do not agree with
the committed manifest; it never overwrites the recorded provenance.

## September 2026 market-stock captures

`data/raw/releases/2026-09-07-location-expansion/market-stock/` retains the
controlled Rightmove resolver JSON and filtered sale/rent HTML capture for each
covered portal region. `record_market_stock_capture.py`
records URL, filter request, capture time and SHA-256 in the release manifest;
`prepare_market_stock.py` fails if the resolver mapping or the single headline
`resultCount` field changes, then writes the two tenure-specific `oneBedCount`
fields, `market.csv` and an ignored row-level staging audit. This is a dated
advertised-stock snapshot, not an inventory. Bournemouth–Poole explicitly sums
the separately resolved Bournemouth and Poole portal regions, whose proprietary
boundaries may overlap or differ from the broad comparison geography.

## Fresh crime research schema

`data/derived/crime_boundary_audit.csv` is a build-generated location-level
comparison with the pinned ONS April 2025 LA/CSP/PFA relationship table. It retains
canonical codes, lookup member LAs and force codes, pair agreement, split-LA flags,
review reasons, lookup date and source/metadata URLs, timestamps and hashes.
`boundary_compatibility` remains unverified and `lsoa_to_csp_ready` remains no.
The raw table, item metadata and Police.uk geography definitions are in
`data/raw/crime/boundaries-2026-09-05/`; acquisition is separate in
`scripts/acquire_crime_boundaries.py`. This audit does not amend input mappings
or assert matching population boundaries.

`data/derived/crime_coverage.csv` is a separate build-generated Police.uk notice
audit keyed by force and month, sourced from the hashed raw coverage snapshot.
It retains source URLs/timestamps/hashes, monthly and ongoing notices, later
notices for review, and an explicitly unknown ASB completeness field. `BTP` is
an internal provider identifier, not an invented ONS geography code. See the
crime replacement document for acquisition and interpretation limits.

`data/derived/crime_residual_audit.csv` is a build-generated force/category
summary of offences outside named CSP rows. It deduplicates repeated force totals,
retains the source evidence, and marks residuals of at least 5% for investigation.
Residuals are review metadata and are never assigned to locations.

`data/derived/crime_outlier_audit.csv` is a build-generated QA queue containing
the three lowest and highest available calculated rates for each offence category.
It retains counts, populations, geographies, force residuals and source evidence.
It is contextual review metadata only; it is not an additional safety input.

See [crime replacement](crime-replacement.md) for source selection, limitations
and reproduction. These observations are freshly retrieved, not legacy imports.

- `data/inputs/crime_geographies.csv`: one row per mapped location; LA code, CSP
  code/name, boundary vintage (blank if unknown), source edition and mapping reason.
- `data/inputs/crime_observations.csv`: key `(location_id, category)`; count, matched
  CSP population, population period/rounding, crime dates, published rate, force
  total and unallocated count, coverage, evidence ID, URL, retrieval date, source
  cells and SHA-256. Counts are nonnegative integers or blank. The preparer writes
  this table from the raw workbook and editable mapping.
- `data/raw/crime/2026-09-05/manifest.csv`: original workbook filenames, exact
  acquisition URLs, retrieval dates and hashes. Workbooks retained in full.
- `scripts/aggregate_asb.py`: research-only Police.uk ASB aggregator. It accepts
  an archive, period and dated ONS geography lookups; explicit LAD code
  translations document the Barnsley and Sheffield 2025 code changes. The
  `data/derived/asb_2025-04_2026-03*.csv` outputs are not canonical until
  coverage and split-LA review is complete.
- `data/raw/crime/police-2026-09-05/manifest.csv`: the retained Police.uk March
  2026 archive's URL, retrieval time, size and SHA-256. Its 1.6 GB ZIP exceeds
  GitHub's per-file limit and is not in Git. After cloning, restore it with
  `python3 scripts/rehydrate_raw.py data/raw/crime/police-2026-09-05`; the
  command downloads only a missing ZIP and verifies its committed checksum and
  size before writing it.
- `data/derived/crime_source_tables/`: build-generated C1/C2/C4, CSP notes and ASB
  D4/D5 CSV exports; `source_row` and Excel column letters preserve cell identity.
- `data/derived/crime_research.csv`: build-generated row per location/category,
  including unknown ASB and unmapped additions. Adds rate per 1,000 (3 decimals),
  force unallocated percentage, transformation, missing reason and review status.
  Rates use resident populations, not household denominators or old radius counts.

Build checks crime foreign keys, duplicates, periods, evidence references, numeric
validity, source hashes and compatibility with published rates allowing population
rounding. Those checks are arithmetic/provenance checks, not evidence that every
force reported all incidents. Reviewed ONS CSP offence rows are emitted into
`web/data.js` as separate measures. The documented broad score derives its limited
recorded-offence proxy from the two ONS rates; ASB remains excluded.
