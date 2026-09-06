# Preparing reproducible location expansion

## Decision and feasibility

Adding a place to the current screen is mechanically straightforward: add one
identity row and the relevant topic rows, evidence rows and source links, then
run the existing build. A place with no topic rows is intentionally valid and
will appear with unknown measures and no composite score.

Adding places with evidence comparable to the present screen is feasible, but
should not be done by extending the imported 2026 values. The non-crime values
are unverified pre-repository chat artifacts, produced recently by OpenAI models;
they are not old research, but their original raw downloads, query parameters
and transformations were not retained. The crime observations are fresh and
reproducible. Re-establishing provenance means producing a new, dated evidence
release for the *whole* screen, rather than adding freshly collected values next
to values from an unmatched period or method.

The recommended outcome is a release-based acquisition pipeline for **new and
changed data**. It should download or retain each upstream artifact once,
checksum it, transform it offline with versioned scripts, and emit canonical
input CSVs plus an evidence catalogue. The scripts must be parameterised by
release directory and period, not by the current 63 IDs or a fixed row count.
It does not require retrospectively acquiring an artifact for every current row.

## Scope decisions required before implementation

Approve these rules before collecting data. They prevent apparently objective
scripts from silently choosing incompatible geographies.

| Decision | Recommended rule | Why it matters |
| --- | --- | --- |
| Unit of comparison | Continue with named broad places, not neighbourhoods or listing samples. | Preserves the stated screen scope. |
| Place-to-statistic geography | Keep a documented mapping for each topic: a named-place proxy for price, LA proxy for rent, CSP proxy for recorded offences and a portal region for stock. | No single statutory boundary represents every named place. |
| Refresh model | Keep the current 63 as an explicitly imported baseline; collect each new-location cohort in one dated release and retain its artifacts. A full baseline refresh is optional later. | Avoids pretending that legacy and new values have identical provenance while avoiding unnecessary backfill. |
| Price definition | Retain a 24-month category-A flat/maisonette achieved-price median across all sizes, with transaction count. | It is reproducible, but must remain labelled as an all-size proxy. |
| Rent definition | Retain the ONS one-bedroom LA modelled monthly mean. | It is scalable and official, but is not an asking-rent median. |
| Stock source | Obtain written permission or use a licensed/officially supported data feed before automating portal collection. | A browser-result count is volatile and an unsupported scraper can breach terms or fail without warning. |
| Qualitative factors | Either replace them with published, scriptable measures or explicitly keep a versioned human review stage. | Current broad judgements cannot honestly be recreated from links alone. |
| Expansion geography | Confirm candidate places and whether London is borough-scale or excluded pending a separate design. | A single London row conflicts with the current population-centre approach. |

## Validation first: test the claimed method on a small sample

Before building a full refresh, run a reproducibility probe against a stratified
sample of existing locations. This is the recommended first implementation step:
it can confirm that the stated calculation and geography rules are sufficient,
or pinpoint the missing rule before full collection. It is much cheaper in review
time and in portal/manual capture work, but its download saving varies by source.

Use 10--12 locations selected before calculation, covering England and Wales,
large and small places, a low/high price range, an LA that differs materially
from the named place, a portal-name alias and known geography exceptions
(including Torbay, Kettering and Northampton where relevant). Do not select only
rows that appear easy to reproduce.

For each topic, retain the same raw artifact, manifest and offline preparer that
the full release would use, but emit rows only for the selected IDs. Compare the
result against the imported input with an explicit result code:

| Topic | Probe and comparison rule | What a mismatch means |
| --- | --- | --- |
| Crime | Re-run the retained ONS preparer for the sample. Expect exact source-cell/count/population agreement when using the same release. | A changed source, mapping or workbook interpretation; investigate before expanding. |
| Rent | Download one archived/current ONS edition and extract the stated July 2026 LA/one-bedroom value. Expect an exact whole-pound match after the documented rounding rule. | Usually an edition, LA mapping, sheet/column or rounding difference. |
| Buy | Apply the stated 24-month/category-A/flat rule and each selected place's documented query key. Expect exact median and transaction count if the same source release is available. | Often an unstated Town/City versus District query, snapshot revision, date boundary or transaction filter. |
| Stock | Reproduce only the selected resolver/search captures, using the original date only if an artifact survives. | A live result is expected to differ; it validates query construction, not the historic snapshot. |
| Transport/quiet/condition | Test the proposed rubric against the selected assessments and retain reviewer decisions. | A mismatch may reveal that the prior model used unrecorded judgement; it is not proof that either label is wrong. |

The HMLR probe may still require sizeable annual data files: its public yearly
files are country-wide rather than place extracts. The official report builder
can create a smaller location/date/property-type export for exploratory checking,
but the full release should retain either those exact exports and requests or the
bulk files needed to reproduce them. By contrast, the relevant ONS rent workbook
is a single modest release file, so sampling does not materially reduce that
download. The official source documents both HMLR bulk/yearly downloads and a
report builder, and ONS retains dated PIPR editions. [HMLR Price Paid Data](https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads)
[ONS PIPR dataset](https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics)

Treat a probe as successful only when every selected quantitative row either
matches under the predeclared rule or has a specific, evidenced explanation. Do
not adjust scripts until figures match: record the discrepancy first, then decide
whether the source release, transformation rule or imported claim is the value
to retain. A successful sample increases confidence in the method; it does not
prove the other rows. It supports retaining them as an imported,
method-validated baseline with the existing limitation label. It does **not**
turn each current row into a fully reproducible observation. A full backfill is
needed only if the project later wants to claim source-to-output reproducibility
for every baseline row or to place all locations in one uniform release.

## Target release layout

Use a release label such as `2027-03-15` chosen when acquisition starts. Keep
raw, transformed and presentation layers separate.

```text
data/
  raw/
    releases/<release>/
      manifest.csv                 # URL, request/query, retrieval time, SHA-256, licence/terms note
      geography/                   # downloaded lookup files and resolver responses
      price/                       # original HMLR files
      rent/                        # original ONS workbook/CSV and metadata
      stock/                       # permitted captured responses or authorised export
      transport/                   # timetable/API responses, if an approved machine source exists
      environment/                 # source tables/geospatial extracts
  staging/<release>/               # ignored or generated; normalised source extracts and QA reports
data/inputs/
  ...                              # only reviewed canonical rows used by build.py
scripts/
  acquire_*.py                     # network download only
  prepare_*.py                     # offline extraction only
  validate_release.py              # cross-topic completeness and provenance checks
```

`manifest.csv` should have one row per retained artifact and include: relative
path, original URL, complete request/query parameters (redacting secrets), HTTP
retrieval timestamp, source data period, SHA-256, MIME/type, publisher, licence
or terms reference, and any known coverage limitation. Each prepared row should
carry an `evidence_id`; where a source has place-specific queries, retain a
row-level source identifier and the raw-file path or source-cell reference.

Do not put a clock timestamp in generated broad-screen outputs. Acquisition
records timestamps; preparation and build remain deterministic and offline.

## Work plan

### 1. Establish a location registry and geography mappings

Create an editable registry for proposed and accepted places, separate from the
current display input. For each stable `location_id`, record the display name,
country, centroid coordinates, centroid source/query, local-authority code and
name, price-query key, rent LA code, CSP code, portal resolver query/region ID,
and any exception rationale. Codes and the lookup edition must be retained, not
just names.

Write `scripts/prepare_locations.py` to turn a reviewed registry into
`locations.csv` and `crime_geographies.csv`. It should fail on duplicate IDs,
unresolved codes, stale/missing lookup artifacts and mappings outside the
approved release. A deliberate exception such as Torbay must be an explicit row,
never an implicit special case in Python.

Acceptance gate: every proposed place has a documented mapping for each
statistic that will be shown, or the measure remains blank with a missing-data
reason. Do not infer a town's value from a nearby town or its county.

### 2. Reproduce the recorded-offence workflow for all places

The crime path is largely ready now. `acquire_crime.py`,
`acquire_crime_boundaries.py`, `prepare_crime.py` and the build-time crime checks
already retain source URLs, hashes, cells, periods, populations and mappings.

Before using it for a new release, parameterise the currently pinned source
period, workbook headers/columns, evidence ID and release path. Preserve the
fail-closed behaviour: a changed ONS layout or a changed population basis should
stop preparation until reviewed. Add tests for an extra mapped location and for
an explicit geography exception. Retain ASB as research-only unless its existing
coverage and split-geography gates pass.

Acceptance gate: every displayed offence rate has a named CSP mapping, matching
numerator and population geography, source cell, source hash and rate
reconciliation. It remains a limited recorded-offence measure, not a safety
finding.

### 3. Build a fresh price acquisition and preparation path

Create `acquire_price_paid.py` to download the exact HMLR releases used for the
chosen 24-month window and write their manifest entries. Create
`prepare_buy.py` to read those retained files offline, assert the expected Price
Paid schema, select category-A flat/maisonette transactions, apply the approved
per-place price query mapping, calculate median and count, and emit `buy.csv`
and a row-level audit CSV.

The audit needs source-file hashes, selected date range, query key, selected row
count, excluded-row counts by reason, and the pre-median value list or a
reproducible aggregate sufficient for independent recomputation. The mapping
rule is the key review item: the current Town/City-field method is reproducible
only after each place's exact query value and any exception are preserved.

Acceptance gate: all price rows come from one declared window and method. A
place with too few transactions should receive a documented confidence downgrade
or blank value according to a rule fixed before looking at results.

### 4. Build a fresh rent acquisition and preparation path

Create `acquire_rent.py` to retain the selected ONS release and its metadata,
then `prepare_rent.py` to assert the edition, period, unit, bedroom category and
LA-code fields before extracting one-bedroom monthly means. Use LA codes from
the registry rather than matching local-authority names. Emit `rent.csv` and an
audit containing the original table cell/row, source hash, model version or
edition and any provisional-status flag.

Acceptance gate: all places use the same ONS edition/month and the displayed
label continues to say modelled LA mean. If a mapped LA has no compatible value,
leave it blank rather than substituting a regional figure.

### 5. Resolve stock data as a product and permission issue

Rightmove counts are the least automatable current measure. First determine
whether a permitted API, licensed export or written collection approval exists.
If it does, write an acquisition client that records the resolver request,
region ID, exact search filters, returned headline count, response body and
timestamp; `prepare_stock.py` should validate the response schema and produce
the buy/rent `oneBedCount` fields and `market.csv` audit text.

If no approved machine source exists, retain a short, controlled manual capture
protocol instead of an unofficial scraper: generate parameterised query URLs
from the registry, capture the response/export and time, store it in the raw
release, and require a reviewer to enter or confirm the count. The build should
be able to show blank stock values without penalising a location. The release
must never mix portal snapshots from different days without recording that fact.

Acceptance gate: every nonblank count has the exact resolver geography, filters,
capture artifact and timestamp. Counts remain headline advertised-stock snapshots
and are not deduplicated listing inventories.

### 6. Make transport and environmental factors reproducible

There are two honest options.

1. Replace broad assessments with a small set of published, machine-readable
   measures and documented thresholds, acquired as raw snapshots and calculated
   by scripts.
2. Keep the present categorical assessments, but define a reviewer worksheet
   with fixed evidence inputs, a rubric, two-person review/decision record and a
   `method_version`. Scripts can create the worksheet, validate evidence IDs,
   check completeness and assemble outputs; they cannot derive a defensible
   judgement from prose links alone.

For national transport, use an approved timetable/API/export if available and
record a fixed weekday, departure window, origin station, destination station,
transfer rule and response. If no such source is available, treat journey times
as a reviewed snapshot and do not claim fully automated collection. For quiet and
condition, published noise/map/deprivation datasets can be reproducibly
extracted, but the conversion to the existing three-band assessments needs an
approved rubric; deprivation must not become a proxy for appearance or upkeep.

Acceptance gate: a categorical value is either reproducibly calculated from
versioned data and thresholds, or has a complete review record. Otherwise it is
blank and the composite score is blank, as the existing methodology requires.

### 7. Strengthen schemas, validation and release QA

After the registry and preparers exist, extend the build validation rather than
relaxing it. Add fields or companion audit CSVs for source release, evidence ID,
geography code, source row/cell or raw artifact, retrieval date, data period and
method version. Validate foreign keys from every topic and audit row; validate
that every evidence ID describes the actual release; reject mixed release IDs
unless the methodology explicitly permits them.

Add tests that prove:

- an arbitrary number of additional locations flows through the pipeline;
- a new place may be incomplete, but no missing value becomes zero;
- every nonblank metric has a valid evidence and raw-artifact reference;
- changed upstream headers, hashes, codes, units, periods or response schemas
  fail closed;
- repeated preparation and `scripts/build.py` produce byte-identical outputs;
- composite score bands adapt to the current location set without hard-coded
  counts.

Produce a generated `release_audit.csv` with one row per location/topic showing
status (`ready`, `missing`, `review-required`), geography, source period,
artifact hash and reason. This is the practical expansion checklist and makes
gaps visible without filling them.

### 8. Pilot, then publish an expansion cohort

Pilot the entire path on a small, deliberately varied set of approved places:
one English unitary authority, one two-tier English town, one Welsh place and
one mapping exception if applicable. Review the raw-to-input audit manually,
compare independent recalculation of a sample of price/rent/crime rows, and fix
the schema or mapping rules before processing all candidates.

Then collect one complete release for the approved additions. Keep the existing
63 inputs unchanged unless the validation probe identifies a specific error;
record the additions' release IDs, periods and geography mappings beside their
rows. This creates a transparent mixed-provenance screen, rather than implying
that the inherited rows have been freshly acquired. Rebuild the generated
outputs, run the full test suite, inspect the browser for unknown and
composite-score behaviour, and update methodology/provenance to describe the
baseline and the new cohort separately. Commit canonical inputs, scripts, raw
manifests (and retained raw artifacts where repository size permits), generated
outputs and documentation together.

## Completed foundation and remaining probe work

Status at 6 September 2026:

- The predeclared, stratified 12-place probe is in
  `data/registry/validation_probe.csv`. Its reviewed price and rent mappings
  are in `data/registry/validation_probe_mappings.csv`. Its completed rent and
  buy result cells are generated from the retained release comparison; other
  topic results remain blank.
- The empty expansion registry, registry preparer, release-manifest controls
  and generated release audit are in place. The audit deliberately continues to
  mark imported non-crime baseline rows as `review-required`; no missing value
  is converted to zero.
- The retained 19 August 2026 ONS PIPR workbook has been prepared for the
  `2026-09-06-baseline-probe` release. All 12 July 2026 one-bedroom LA rent
  values match the imported values. This validates only the stated rent
  extraction and mappings for those rows.
- The official 2024, 2025 and 2026 HMLR yearly CSV artifacts are retained in
  the probe release and recorded in its manifest. The offline price preparation
  and comparison have been run for all 12 predeclared locations. All medians
  and transaction counts match the imported baseline after documenting the
  whole-pound half-up median rule; their source-field keys are explicitly
  uppercase as supplied in HMLR bulk files. This validates the price method for
  the sample only.

The price comparison evidence chain is now complete and reviewed for the
predeclared sample. The steps below record the completed standard; they remain
the required procedure for any future probe.

1. Obtain the exact HMLR Price Paid Data bulk artifacts or report-builder
   exports needed to cover **1 July 2024 through 30 June 2026 inclusive**. Do
   not substitute a current report, a differently bounded window, or an
   undocumented summary. Retain the original files/exports under
   `data/raw/releases/2026-09-06-baseline-probe/price/` and record every
   artifact's URL, complete request/query, retrieval timestamp, source period,
   SHA-256 and limitations in that release's `manifest.csv`.
2. Confirm that the retained artifacts have the expected HMLR fields and that
   together they cover the whole declared window. Preserve the reviewed query
   keys, including Torbay's `District` exception; do not infer or normalise
   query values while processing.
3. Run `prepare_buy.py` offline with the retained release, the reviewed probe
   mappings and the predeclared probe list. It must apply exactly the fixed
   inclusive dates, category-A and flat/maisonette filters, then retain the
   prepared values and its row-level audit outside the canonical imported
   baseline inputs.
4. Run the comparison utility against the imported buy values. Record a result
   for every probe location: `match`, or a specific evidenced discrepancy such
   as date-boundary, query-field, source-revision or filter difference. Do not
   alter an imported buy value merely to make the result match.
5. Only after all twelve comparisons are recorded may the price method be
   called method-validated for the sample. Even then, it does not validate
   untested baseline rows or convert the legacy baseline into a fully
   source-to-output reproducible release.

After that buy probe is resolved, the next decisions remain product and scope
decisions rather than unfinished mechanics: approve the expansion cohort and
London treatment, authorise a stock-data source or controlled manual protocol,
and choose a reproducible or reviewed rubric for qualitative factors. A full
baseline refresh is optional and should be undertaken only when a uniform
source release is worth the collection work.

## What this will and will not solve

This plan can establish a reproducible chain from retained source artifact to
each new or changed displayed field, make geography choices inspectable and
allow a new location to be processed repeatedly without agent memory. The
existing baseline retains its imported-artifact qualification after a successful
sample validation; it has not gained raw artifacts it never had. The plan also
cannot make the proxies more precise than their source geographies: achieved
all-flat prices remain different from one-bedroom prices, LA rents remain broader
than towns, CSP offences remain coarse, and portal stock remains a dated
proprietary snapshot. Those limitations should remain visible in the evidence
catalogue and interface.
