# Provenance and CSV schema

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
| buy.csv | `location_id`; proxyMedian (GBP), transactions, oneBedCount, affordabilityConfidence/Reason | JS buy; AFF-BUY-PPD-2024-26; counts use MT-RM-SEARCH-20260905 |
| rent.csv | `location_id`; proxyMonthly (GBP/month), oneBedCount, affordabilityConfidence/Reason | JS rent; AFF-RENT-PIPR-2026-07; counts use MT-RM-SEARCH-20260905 |
| market.csv | `location_id`; reason | JS market; MT-RM-SEARCH-20260905 / MT-RM-LOS-20260905 |
| localTransport.csv | `location_id`; explicit assessment, confidence, evidence IDs, method version and reason | Current broad assessment; the band drives the score while reason is explanatory context |
| nationalTransport.csv | `location_id`; londonMinutes/Changes, birminghamMinutes/Changes, confidence and reason | JS nationalTransport; TR01 and per-location transport links |
| transport_stations.csv | `location_id`; reviewed origin CRS, name, rationale, confidence and evidence IDs | National-transport acquisition workstream; contains reviewed mappings for all 83 screen locations |
| transport_route_observations.csv | one review-only, manually transcribed route observation per location/destination, with planner query, timed itinerary and capture reference | National-transport acquisition workstream; not a canonical replacement until a complete release is approved |
| quiet.csv, condition.csv | `location_id`; explicit assessment, confidence, evidence IDs, method version and reason | Current broad assessment; the band drives the score while reason is explanatory context |
| sources.csv | `location_id`, topic, url; multiple rows per location/topic | JS sources; original links, including archived crime context |
| evidence.csv | `id`; workstream, title, publisher, url, dataPeriod, retrievalDate, geography, coverage, limitations | JS evidence; inherited source-level metadata |

The topic-to-evidence mapping above documents the inherited common periods. Exact
links by location live in sources.csv. For local transport, quietness and
condition, `evidence_ids` is a semicolon-separated list of evidence-catalogue
IDs and `method_version` identifies the assessment rubric. `assessment` is a
validated enum and is the only input to the associated composite factor; reasons
are never parsed to derive a score. These are source references rather than
proof of a row-level observation; some point to general homepages or planners.
Crime references remain for provenance but are hidden from the active browser view.

Initial inputs remove `safety` and fields containing score, unknowns, weakness or
composite. Removed values remain archived. Active inputs are maintained separately;
archive extraction never overwrites them.

## Generated outputs and checks

`build.py` joins topic rows to identities by ID; missing topic rows become unknown.
It writes a flat dotted-column broad_screen.csv and the browser's JS data object.
It validates unique identities, topic foreign keys, duplicate topic rows, numeric
values and source URL schemes. It does not validate upstream statistical truth.
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

## Expansion release controls

`data/registry/location_registry.csv` is an intentionally empty, editable intake
register for future places. The legacy 63 are not copied into it, because doing so
would falsely make their unresolved price, rent and portal mappings look reviewed.
Accepted registry rows must identify all topic geographies and a retained lookup
artifact in `data/raw/releases/<release>/manifest.csv`; proposed rows instead
state why a mapping is missing. `scripts/prepare_locations.py` fail-closes on
duplicate IDs, unresolved mappings, absent release artifacts, bad checksums and
out-of-scope countries, and produces explicit review candidates rather than
changing canonical inputs by default.

Every new raw release has a `manifest.csv` with the columns documented in
`scripts/release_manifest.py`: relative artifact path, URL, complete request/query,
retrieval time, data period, SHA-256, MIME type, publisher, licence/terms and
coverage limitations. `scripts/release_audit.py`, run by `build.py`, writes
`data/derived/release_audit.csv`. It is one location/topic checklist row with
`ready`, `missing` or `review-required`; current non-crime baseline values remain
`review-required` because their row-level raw artifacts do not survive. The ONS
crime rows are `ready` only because their retained workbook hash is present.

`data/registry/validation_probe.csv` predeclares the 12-place stratified method
probe described in the expansion plan. Its completed rent and buy result columns
record the retained release comparison without altering imported baseline values.

## July 2026 price and rent probe

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
imported baseline after that documented rounding rule. Together with the
already matching rent results, this validates the stated methods and mappings
for this sample only; it does not make untested baseline rows reproducible.

The three HMLR yearly CSVs exceed GitHub's per-file size limit and are therefore
not in Git. Their committed release-manifest rows retain the URLs, retrieval
times and SHA-256 values. After cloning, run
`python3 scripts/rehydrate_raw.py data/raw/releases/2026-09-06-baseline-probe`.
It downloads only missing artifacts and fails if their bytes do not agree with
the committed manifest; it never overwrites the recorded provenance.

## September 2026 expansion market-stock captures

`data/raw/releases/2026-09-07-location-expansion/market-stock/` retains the
controlled Rightmove resolver JSON and filtered sale/rent HTML capture for each
portal region used by the 20 expansion locations. `record_market_stock_capture.py`
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
