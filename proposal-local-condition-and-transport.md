# Objective proposals for local condition and local transport

> Implementation status, 9 September 2026: the local public-transport
> connectivity proposal is implemented. The retained implementation uses the
> official April 2024 OA-to-BUA best-fit lookup, the available official lookup
> for this geography vintage, and documents that choice in
> `docs/local-transport-methodology.md`. Local housing condition remains a
> proposal and the inherited condition measure is unchanged.

## Decision

Replace the two inherited, reviewer-assigned assessment bands.  They have no
defined observation unit, no consistent threshold, and therefore cannot be
reproduced or meaningfully updated.  The replacement should keep the screen at
the existing *broad location* level, use the same settlement geography for both
criteria, publish the underlying value as well as the five-point score, and
retain a dated source release.

**Operational constraint:** an ordinary refresh must be one or a few bulk,
public-download fetches followed by offline processing.  It must require no
per-location browser or Playwright task, no address-by-address query, no human
copying from maps, no account/login, and no paid API.  A source which ceases to
provide a complete machine-readable national release fails this proposal until a
similarly open replacement is approved.  Both recommended sources meet this
constraint today: DfT provides one ODS download for the connectivity metrics,
and the England release includes a downloadable File 8 of underlying indicators
while the Welsh indicator table is publicly downloadable.[^10][^18][^19]

| Existing field | Proposed displayed name | Underlying measure | Direction |
| --- | --- | --- | --- |
| `localTransport` | Local public-transport connectivity | Population-weighted DfT public-transport connectivity score (0--100) | Higher is better |
| `condition` | Local housing condition | Population-weighted estimated share of dwellings in poor condition | Lower is better |

These are useful *area-level proxies*, not statements about a particular flat,
street, building, service reliability, accessibility for a disabled traveller,
or the visual attractiveness of a place.  In particular, "local condition"
must be renamed in the UI and documentation to **Local housing condition**.  It
cannot validly mean "how nice an area looks".

The housing-condition sections below remain a proposal only. The transport
sections record the design now implemented in the current CSVs, generated
outputs and composite score; the implementation documentation is authoritative
where it records the April 2024 lookup actually used.

## Shared geography and scoring rules

### The unit being compared

The current screen contains broad named locations rather than local-authority
districts or neighbourhoods.  Use the ONS **Built-up Areas (BUA), December
2024** geography as the default measurement area.  It is an England-and-Wales
settlement boundary product, generated consistently from 25-metre built-up grid
cells.[^1]  It is much closer to what a user understands as a town or city than
an LA boundary, and avoids making a large rural hinterland determine a town's
score.

Add a small, reviewable `data/inputs/location_geographies.csv` rather than
trying to match names in code:

```text
location_id,geography_type,geography_code,geography_name,boundary_vintage,
mapping_basis,confidence,reason
barnsley,bua,E6300...,Barnsley,2024,reviewed_named_settlement,high,...
```

The mapping must be manually reviewed against the current location scope and
record why it is appropriate.  Some candidates will not have a one-to-one BUA:
for example, a conurbation, a district-like name, or a coastal area with several
settlements.  For those, add an explicit **composite of named BUAs** with the
component codes and population weights in a separate mapping table.  Do not
silently fall back to the local authority, an arbitrary radius, or a nearby
town.  If no defensible settlement geography can be agreed, leave both new
criteria blank for that location.

For each source's small-area observations, use the official OA-to-BUA lookup
where available.  Aggregate as a population-weighted mean using the population
field supplied with the source release (or the matching ONS small-area estimate,
with its vintage recorded).  This means the result describes the typical
resident of the broad settlement, rather than its geometric centre or its
largest small area.  ONS provides built-up-area names, codes and lookups, and
its BUA geography is explicitly intended as a single settlement layer.[^2]

### Five-point scale

Keep the existing composite's 1--5 convention, but do not use subjective labels
or thresholds chosen after looking at favourite places.  On each source refresh:

1. Calculate the raw, population-weighted value for every location with valid
   coverage.
2. Calculate population-weighted quintile cut-points from **all England and
   Wales small areas in that same official release**, not from the screen's
   83 candidates.  Store the five cut-points in a versioned methodology/release
   record.
3. Assign 1--5 by those national quintiles: high connectivity gets 5; low
   estimated poor-condition prevalence gets 5.  A boundary value goes in the
   better score band; publish the rule.

National reference quintiles give the score a stable, interpretable benchmark
and avoid a candidate list changing everybody's score.  The raw value and its
release percentile should be the primary evidence shown in the browser.  The
integer is only the composite input.  Recalculate all locations atomically for
a new release; never mix England and Wales editions or update a single row.

Do not manufacture precision.  Display public-transport connectivity to one
decimal place and poor-condition prevalence as a percentage to one decimal
place.  Blank remains blank.  A score can be produced only when the full mapped
settlement is covered; partial coverage should be a release failure unless the
uncovered population is demonstrably zero.

## Proposal 1: local public-transport connectivity

### Measure

Adopt the Department for Transport (DfT) **Transport Connectivity Metric,
public-transport mode, all purposes/time-weighted overall score**.  DfT defines
connectivity as the ability to reach employment, services and social
engagements, based on the value of destinations, travel time and observed travel
preferences.[^3]  It produces estimates for England and Wales at 2021 Output
Area (OA), LSOA, local-authority and regional levels; the OA is about 100
households.[^4]

The selected mode is importantly not a stop count or a claim that a place has
"rail".  It models trips using the combined walking, bus, rail, tram/light rail,
Underground and ferry network.[^5]  It reflects access and waiting/service
opportunity because DfT calculates public-transport results at 10-minute
intervals between 06:00 and 22:00 and combines them using National Travel Survey
mode-purpose-time weights.[^6]  Destinations include jobs, education, health,
shopping, leisure/community and social visits.[^7]

**Raw value:** `pt_connectivity_0_100`, the population-weighted mean of the
selected OA public-transport overall values within the reviewed BUA mapping.

**Score:** national population-weighted quintile of the raw value, ascending:
bottom fifth = 1 through top fifth = 5.

This is the recommended implementation over the current categories
`basic_bus_rail`, `useful_bus_rail`, and `dense_multimodal`.  It has an explicit
construct, whole-England-and-Wales coverage, a documented model, repeatable
inputs and an auditable aggregation.  It also gives useful discrimination below
the present floor of 3.

### Why this measure, and what it does not mean

DfT's first published release uses Q4 2024 transport and destination data
(with 2023 provisional BRES employment data), and is intended to be updated
annually.[^8]  Its public-transport network uses timetable data and cross-checks
stop locations against NaPTAN.[^9]  That is materially stronger evidence than
manually counting modes in a place or quoting one journey-planner result.

It remains a **scheduled opportunity** measure.  It does not measure fares,
crowding, cancellations, real-time reliability, personal security, step-free
access, cycling-to-station access, or a specific home's walk to a stop.  The
underlying data/model sources and temporal coverage must be carried to the UI.
The DfT score should not be called "transport quality" or "commutability".

National rail access should remain a separate criterion: it answers the
deliberately different question of a dated, station-to-station connection to
London and Birmingham.  Do not infer either local or national transport from
the other.

### Acquisition and validation

1. Download the released DfT ODS and metadata, record publication/retrieval
   date, source URL, source time period and SHA-256 under a new dated raw
   release directory.  The DfT landing page confirms the downloadable ODS has
   OA, LSOA, LA and regional metrics.[^10]
2. Select only the documented public-transport overall/all-purpose field.  Keep
   the original field name in the retained release and validate it is numeric,
   0--100, present for the required OAs, and from one edition.
3. Join OA observations to the reviewed BUA mapping through the official lookup;
   calculate population-weighted settlement means and national weighted
   quintiles in a standard-library-only transformation.
4. Write a derived review table before canonical inputs: location ID, BUA code,
   covered/expected population, raw score, national percentile, score,
   source period, evidence ID and flags.  Review unmatched OAs, anomalous
   changes and every non-one-to-one location mapping.
5. Only after review, write canonical input rows.  A release succeeds only if
   every location has an approved mapping and complete coverage, otherwise its
   observation remains blank.

Suggested replacement schema (retain the existing evidence conventions):

```text
location_id,pt_connectivity_0_100,national_percentile,score,source_period,
retrieval_date,evidence_id,geography_code,geography_vintage,
population_covered,population_expected,method_version,confidence,reason
```

`confidence` should report evidence/geography quality (`high` for a complete,
reviewed current release), never encode whether a location is liked.  `reason`
is explanatory only and must never determine the score.

## Proposal 2: local housing condition

### Measure

Use the **raw poor-quality-housing indicator** published with the 2025 English
Indices of Deprivation and Welsh Index of Multiple Deprivation (WIMD) 2025.
Use the component value only; do **not** use either overall deprivation index,
domain rank, decile, income, employment, crime, access-to-services, outdoor
environment or housing-cost component.

The construct is unusually well aligned to the desired criterion.  In England,
the 2025 research report defines the indoors measure as the proportion of social
and private homes failing three Decent Homes components.[^11]  In Wales, the
2025 raw poor-quality-housing indicator estimates the likelihood that a dwelling
has a Category 1 HHSRS hazard or is in disrepair; it explicitly uses the same
disrepair criterion as the English 2025 update.[^12]  A disrepair failure means
either a key component needing major repair/replacement or two other components
needing it.[^13]

This is not an import of a deprivation score.  It is a condition/hazard estimate
that happens to be published as an underlying indicator of the two governments'
deprivation releases.  Its value should be named `estimated_poor_condition_pct`
and presented as a **modelled area estimate**, never as a count of known bad
homes or a judgement about residents.

**Raw value:** population-weighted mean estimated percentage/probability of
dwellings in poor condition across the location's mapped LSOAs.  Lower is
better.

**Score:** reverse national population-weighted quintile of the pooled
England-and-Wales raw values: lowest fifth = 5; highest fifth = 1.  Pool raw
percentage/probability values, not England and Wales ranks.  Document the
English and Welsh source fields and units in the release manifest and stop if
their definitions, vintages, or units are not demonstrated comparable.

### Why this is preferred, and the flat-specific caveat

It is a better condition measure than age of stock, EPC band alone, fly-tipping,
council complaints, street imagery, listing descriptions, or general
deprivation.  It targets disrepair and severe housing hazards across social and
private homes, uses an all-dwelling housing-stock model, and is available at a
small-area geography.  The Welsh methodology describes surveyor-inspected,
all-tenure condition survey data as the model basis and identifies predictors
including age, type, size, tenure, construction, heating and fuel.[^14]

Nevertheless it is **not flat-only**.  The broad screen's price and rent proxies
are for flats/one-bedroom homes, while this source represents all dwellings in a
settlement.  A one-bedroom-flat-only area measure is not currently published at
the required England-and-Wales small-area coverage.  The UI must therefore say:

> Estimated prevalence of poor-condition dwellings across the broad settlement;
> not an inspection or prediction for a particular flat.

That limitation is preferable to inventing a false property-specific result.
Show it beside the raw percentage and retain it in `evidence.csv`.

An EPC-only replacement is not recommended as the headline condition score.
EPCs are an asset energy assessment under standardised assumptions, not observed
maintenance, damp, structural disrepair or safety; the open certificate service
also includes certificates that may have expired or been replaced.[^15]  EPC can
later be added as a separately labelled *energy-performance context* field, not
folded into condition without a stated user preference.

### Acquisition and validation

1. Retain the full 2025 England and WIMD 2025 bulk download, technical report,
   retrieval dates, checksums, source periods and exact column names.  Use the
   raw small-area indicator datasets, not a map colour, index score, rank or
   local-authority aggregate.  WIMD publishes indicator values and also notes
   that its LA entries are only available where an underlying indicator can be
   aggregated; the LSOA source is the appropriate granularity here.[^16]
2. Build a narrow source adapter for each country.  It must validate the raw
   field's unit and direction, uniqueness of LSOA code, non-negative bounded
   values, and source definition/version.  It must not perform a within-country
   rank transform.
3. Join LSOAs to each reviewed BUA mapping via OA shares, and aggregate with the
   source's population denominator.  Store expected and covered population and
   fail partial mappings rather than treating absent values as zero.
4. Pool only semantically comparable England and Wales raw values to make the
   national reference distribution; calculate and retain the five weighted
   thresholds.  If an updated release changes either definition materially,
   document a break and do not call it a continuous series.
5. Produce an independently reviewable staging CSV and hand-check the complete
   mapping, country adapters, extreme values and score boundaries before making
   it canonical.

Suggested canonical schema:

```text
location_id,estimated_poor_condition_pct,national_percentile,score,
source_period,retrieval_date,evidence_id,geography_code,geography_vintage,
population_covered,population_expected,method_version,confidence,reason
```

The England/Wales source release identifiers may be held in a semicolon-separated
`evidence_id` field as the repository currently does, but a release manifest
should keep the country-specific file and field mapping explicit.

## Rejected alternatives

| Alternative | Decision | Reason |
| --- | --- | --- |
| Existing qualitative bands | Reject | Not operationalised, not reproducible, and only 3 values conceal uncertainty. |
| Stop/station counts, a rail-presence flag, or one selected timetable | Reject for local transport | Measures infrastructure presence or one route, not the daily ability to reach a useful range of destinations; vulnerable to arbitrary catchments and mode choices. |
| Build a bespoke national router from individual operator feeds | Defer | Potentially valuable, but high maintenance and coverage risk, especially cross-border.  DfT's published, multi-modal, England-and-Wales model is the stronger current baseline. |
| WIMD access-to-services domain | Reject as the common metric | Useful Welsh corroboration, but England's discontinued journey-time series is not comparable.  The new DfT measure already covers both countries consistently. |
| EPC score/band as local condition | Context only | It measures standardised energy asset performance, not condition/hazards; certificate coverage/selection and expiry make it unsuitable as the headline construct. |
| English/Welsh overall deprivation or living-environment ranks | Reject | They bundle non-condition constructs and ranks are country-relative.  Using them would violate the project's explicit rule that deprivation is not a proxy for appearance/condition. |
| LA-owned-stock Decent Homes returns | Reject | England-only and limited to local-authority-owned stock, so not representative of private and housing-association flats; reporting/coverage caveats remain.[^17] |
| Street imagery, portal prose, user ratings or fly-tipping reports | Reject | Subjective, non-uniform, selectively reported, and not a valid whole-settlement dwelling-condition observation. |

## Integration plan and safeguards

1. Add the reviewed location-to-BUA mapping and source adapters without touching
   current values.  Treat both datasets as an acquisition/transformation
   workstream, analogous to the documented national-transport workflow.
2. Add raw source snapshots, manifests and release-level validation.  Keep
   acquisition, transformation and presentation separate; use Python standard
   library only in pipeline code.
3. Add `local_transport_objective.csv` and `housing_condition_objective.csv`
   initially, so the existing qualitative inputs remain intact during review.
   Include provenance columns above and an evidence-catalogue row per source.
4. Add tests for: unique locations; complete approved mapping; no missing-as-zero;
   0--100/percentage bounds; full covered population; quintile boundary rules;
   all candidates flowing through without hard-coded counts; and preservation of
   raw value, period, geography and evidence ID in generated output.
5. Review the staging release.  Compare the two methods' candidate rankings only
   as a diagnostic, never as a reason to alter a raw observation or score.
6. Replace the old fields atomically, update `docs/methodology.md`,
   `docs/provenance.md`, UI labels/tooltips and scoring tests, then rebuild and
   run the required test suite.  Remove the inherited assessment text only after
   the replacement is accepted and committed with its generated outputs.

The composite's current 15% weight for each criterion is a preference decision,
not a fact produced by these data.  Keep it initially to isolate the measurement
change, but make it user-adjustable or revisit it separately.  Do not use
confidence to boost or penalise a score; it is evidence context only.

## Sources

[^1]: Office for National Statistics, [Built Up Areas (December 2024) Boundaries EW BGG (V2)](https://www.data.gov.uk/dataset/99d06794-8a5b-42c1-9cb6-e240ae4bc906/built-up-areas-december-2024-boundaries-ew-bgg-v21), accessed 9 September 2026.
[^2]: Office for National Statistics, [Towns and cities, characteristics of built-up areas, England and Wales: Census 2021](https://www.ons.gov.uk/peoplepopulationandcommunity/housing/articles/townsandcitiescharacteristicsofbuiltupareasenglandandwales/census2021), 2 August 2023.
[^3]: Department for Transport, [Transport connectivity metric: Overview and methodology](https://www.gov.uk/government/publications/transport-connectivity-metric/transport-connectivity-metric), accessed 9 September 2026, “Overview of connectivity metrics”.
[^4]: Ibid., “Overview of connectivity metrics” and “Methodology”.
[^5]: Ibid., “Transport networks: Public transport”.
[^6]: Ibid., “Methodology”, public-transport time intervals and aggregation.
[^7]: Ibid., “Data sources” and Tables 1--7.
[^8]: Ibid., “Data sources” and “How the connectivity metric model relates to other methods”.
[^9]: Ibid., “Transport networks: Public transport”.
[^10]: Department for Transport, [Transport connectivity data collection](https://www.data.gov.uk/collections/transport/transport-connectivity), accessed 9 September 2026.
[^11]: Ministry of Housing, Communities and Local Government, [English indices of deprivation 2025: research report](https://assets.publishing.service.gov.uk/media/68ff547a49d08dd781b48351/ID_2025_Research_Report.pdf), 2025, p. 16.
[^12]: Welsh Government, [WIMD 2025 technical report: housing domain](https://www.gov.wales/welsh-index-multiple-deprivation-wimd-2025-technical-report-housing-domain-html), 11 December 2025, Annex 7.2.
[^13]: Ibid., “Disrepair”.
[^14]: Ibid., “Developing a housing stock model for Wales” and “Determining disrepair”.
[^15]: Ministry of Housing, Communities and Local Government, [Get energy performance of buildings data](https://get-energy-performance-data.communities.gov.uk/), accessed 9 September 2026; Office for National Statistics, [Energy efficiency of housing in England and Wales QMI](https://www.ons.gov.uk/peoplepopulationandcommunity/housing/methodologies/energyefficiencyofhousinginenglandandwalesqmi), accessed 9 September 2026.
[^16]: Welsh Government, [WIMD 2025 indicator data by LSOA and local authority: housing domain](https://stats.gov.wales/en-GB/306808da-47db-4e4e-8ff2-66a348505f08/start), accessed 9 September 2026.
[^17]: Ministry of Housing, Communities and Local Government, [Local Authority Housing Statistics: technical notes 2024--25](https://www.gov.uk/government/statistics/local-authority-housing-statistics-technical-notes-2024-to-2025/local-authority-housing-statistics-technical-notes-2024-25), 2026, “Operational context” and “Decent homes”.
[^18]: Ministry of Housing, Communities and Local Government, [English indices of deprivation 2025](https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025), 30 October 2025, File 8: Underlying indicators.
[^19]: Welsh Government, [WIMD 2025 indicator data by LSOA and local authority: housing domain](https://stats.gov.wales/en-GB/8c4e387a-d221-4a24-9fd4-50bdaacbe273), accessed 9 September 2026.
