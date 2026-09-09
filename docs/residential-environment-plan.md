# Replacing local condition with a residential-environment measure

## Implementation status (2026-09-09 handoff)

This plan is partially implemented. The live screen and composite still use
`condition.csv`; do not switch them until the new preparer produces complete,
reviewed outputs for all 83 locations.

Completed foundation:

- added the pinned workbook dependency in `requirements-environment.txt`;
- added `scripts/acquire_residential_environment.py`, with bulk GET/POST requests
  for the official English, Welsh, Defra, ONS/Nomis and geography artifacts;
- retained twelve source artifacts and a hash-verifying manifest under
  `data/raw/environment/2026-09-09/`;
- added shared percentile/quintile helpers in
  `scripts/residential_environment.py`;
- froze the pilot definition, fields, geography, standardisation, missing-data
  behaviour and release gates in
  `docs/residential-environment-methodology.md`;
- added the offline `scripts/prepare_residential_environment.py` pipeline for
  OA-to-grid air assignment, LSOA indicators, 2011-to-2021 green-space
  allocation, BUA aggregation, national percentiles/quintiles, candidate rows
  and the national BUA audit.

The preparer has not yet passed its coverage gate. Run it in an environment with
`openpyxl==3.1.5` using:

```sh
python3 scripts/prepare_residential_environment.py
```

The Welsh noise/EPC coverage gate is now resolved. The retained WIMD downloads
contain one observation for every current Welsh LSOA21, including replacement
codes `W01001981`--`W01001984` in Bridgend. The preparer now uses the official
exact-fit OA21-to-LSOA21 lookup for both countries and reserves the 2011
allocation for the genuinely older green-space source.

### Blocker 1: incomplete green-space coverage

The latest fail-closed result identifies two candidate BUAs whose 2021
population cannot be fully assigned a value from the corrected 2020 ONS
green-space workbook:

| Candidate BUA | Covered / expected population | Missing source allocation |
| --- | ---: | --- |
| Shrewsbury `E63009578` | 75,419 / 75,784 | OA21 `E00187218` has 365 residents; its predecessor LSOA11 `E01028959` has no workbook row |
| Stafford `E63009353` | 70,762 / 71,695 | OA21s `E00179367`, `E00179398` and `E00179419` have 933 residents in total; LSOA `E01029743` has no workbook row |

No other current candidate fails the coverage gate. This is not a broken
2011-to-2021 lookup: the OAs and their predecessor areas resolve. The source
observation itself is absent. The mismatch arises because the old ONS analysis
was restricted to residential urban postcodes, while this project uses April
2024 BUA membership and Census 2021 usual-resident population. A currently
included OA can therefore have residents but no observation in the older
postcode-based source.

Do not clear this blocker by:

- interpreting absence as zero green space or zero access;
- borrowing an adjacent LSOA's value;
- silently removing the residents from expected population;
- renormalising the BUA from its covered residents; or
- calculating a newer value for only these four OAs and mixing it into the 2020
  national series.

The preferred resolution is a new national green-pillar calculation for every
England-and-Wales BUA, probably using current OS Open Greenspace polygons plus a
consistent set of residential origin points. OS Open Greenspace is available as
a bulk OpenData download through the documented OS Downloads API, so source
access is not itself blocked. The replacement still needs a documented choice
of origin-point data, residential filtering, distance and area calculation,
duplicate handling, projected CRS and population aggregation. It must regenerate
the complete national reference distribution rather than patch Shrewsbury and
Stafford. An alternative is an official allocation or postcode-level release
that reproduces the ONS observation for the missing areas.

This blocker is cleared only when all four pillars cover the full expected
population of all 83 candidates and the same green method has been applied to
every national-reference BUA. Until then the canonical environment output and
overall composite must remain incomplete.

### Blocker 2: England-Wales source compatibility

Full row coverage would not by itself make the pilot observations comparable.
Two country-specific measurement differences remain:

1. **Noise scope.** The English IoD 2025 observation includes major-airport
   noise alongside road and rail. The Welsh WIMD observation is road and rail.
   An airport-affected English BUA can therefore be penalised for exposure that
   the Welsh source would not count. This is a systematic definition difference,
   not ordinary sampling uncertainty, and can change the combined national
   percentile distribution and individual candidate scores.
2. **EPC scale.** Wales publishes the rounded mean EPC SAP score. England
   publishes a shrunk deprivation transform derived from mean SAP rather than
   the unshrunk mean itself. The current preparer reverses its direction as
   `100 - published score`, but that operation does not recover mean SAP and
   cannot undo the shrinkage. Consequently, numerical spacing and potentially
   ordering among English areas are not directly comparable with Welsh mean SAP
   values in one England-and-Wales percentile distribution.

The preferred resolution is to obtain or reproduce harmonised raw observations:
road-and-rail-only noise and mean SAP on the same conceptual scale in both
countries. A weaker release option would be to accept the mixed observations as
proxies, label the differences prominently and demonstrate through country
diagnostics and sensitivity analysis that they do not materially distort the 83
candidate results. That option requires an explicit methodological acceptance;
the shared formula alone does not make the inputs harmonised.

This blocker is cleared only by harmonised inputs or a documented acceptance of
the mixed proxies after the planned validation. Until then the new factor must
not replace `condition`, even if the green-space coverage blocker is solved.

Remaining work after the green-coverage and source-compatibility decisions:

1. generate and review the canonical candidate, release and all-BUA audit CSVs;
2. add sensitivity, outlier, correlation and country-domain validation outputs;
3. replace `condition` in build/composite code and add strict reproduction tests;
4. update the browser, evidence/source catalogue, README, methodology,
   provenance and TODO;
5. rebuild, run all tests and visually review desktop and narrow layouts.

## Recommendation

Replace the editorial **Local condition** factor with an objective
**Residential environment** factor.

> Residential environment measures the population-weighted quality of everyday
> residential surroundings across the mapped built-up area: cleaner air, less
> transport noise, convenient public green space and thermally adequate housing.

It should explicitly exclude:

- crime, harassment and perceived safety;
- house prices, rents, affordability and wealth;
- employment and economic opportunity;
- transport or service accessibility;
- schools, nightlife, culture and retail;
- architectural beauty, reputation and subjective “niceness”;
- flood risk and road-collision risk, which concern risk more than everyday
  environmental quality.

This is deliberately narrower than total “pleasantness.” No reproducible
objective dataset can measure every aesthetic and social aspect of pleasantness.
“Residential environment” is a defensible operationalisation of the physical
conditions that regularly affect living somewhere.

The score should have four equally weighted pillars:

| Pillar | Weight | Recommended observation |
| --- | ---: | --- |
| Clean air | 25% | Population-weighted NO₂, PM₂.₅ and PM₁₀ concentrations, normalised against WHO annual guidelines |
| Quiet surroundings | 25% | Percentage of residents exposed to combined road-and-rail noise of at least 55 dB Lden |
| Green-space access | 25% | Proximity to, and amount of, public parks, gardens and playing fields |
| Housing environmental quality | 25% | Mean modelled/imputed EPC Standard Assessment Procedure score |

Equal weighting is preferable to apparently precise expert weights: the four
pillars represent distinct, non-substitutable aspects of the definition, and
there is no evidence-based basis for saying, for example, that air should count
1.4 times as much as green space.

## Why the deprivation domains should not be copied directly

The English Living Environment domain is a strong conceptual precedent. Its
2025 version covers housing energy performance, housing in poor condition,
private outdoor space, air quality, pedestrian/cyclist casualties and transport
noise, with 70% assigned to its indoor sub-domain and 30% to outdoors.[^1]

But its score should not become the project field:

1. It applies only to England. The official release explicitly says it cannot be
   compared with indices for other UK nations.[^2]
2. Wales's Physical Environment domain is materially different: 35% air quality,
   35% flood risk, 15% green space and 15% noise.[^3]
3. The English score includes road casualties, while the Welsh score includes
   flood risk and green space.
4. Both are relative deprivation ranks within their own country, with
   exponential transformations designed to emphasise highly deprived
   neighbourhoods—not to measure cross-border residential pleasantness.
5. Welsh Government identifies differences in geography, indicators, collection
   and publication timing as reasons direct UK comparisons are invalid.[^4]
6. Full IMD/WIMD would introduce income, employment, affordability, service
   access and crime, duplicating or contaminating other project factors.

Therefore:

- borrow the **indoor/outdoor conceptual framework**;
- use compatible **underlying observations**;
- calculate a new England-and-Wales reference distribution;
- retain the official country-domain scores only for within-country validation.

## Recommended pillars

### 1. Clean air

Use Defra's UK-wide 1 km modelled background maps for the latest common completed
calendar year. The current page provides 2024 NO₂, PM₂.₅ and PM₁₀ releases, and
describes annual updates and the underlying modelling.[^5]

For every OA:

```text
air_burden =
    mean(
        NO2 / 10,
        PM2.5 / 5,
        PM10 / 15
    )
```

The denominators are WHO's 2021 annual guideline values in µg/m³.[^6] Lower is
better.

Then convert `air_burden` into a population-weighted England-and-Wales
percentile. Preserve the actual pollutant concentrations and burden value in the
UI; do not show only a score.

Why this formulation:

- it uses the same source and method on both sides of the border;
- guideline normalisation prevents the three pollutants' different scales from
  determining their weights;
- it resembles the official English and Welsh environmental-domain approaches
  without inheriting country-specific ranks;
- the source is refreshable and machine-readable.

### 2. Quiet surroundings

Use the raw 2025 deprivation-indicator observation:

> Percentage of residents exposed to combined road-and-rail noise at or above
> 55 dB Lden.

This is unusually suitable because England and Wales use the same Defra Noise
Modelling System, Census 2021 population, threshold and exposure concept. England
describes 55 dB Lden as the point at which potentially harmful effects are
generally considered to begin; Wales publishes the identical road-and-rail
measure.[^7][^8]

Lower is better. Convert the percentage to a combined England-and-Wales
population percentile.

Limitations must remain visible:

- it models outdoor exposure, not noise inside a particular flat;
- it does not represent neighbours, nightlife or every local industrial source;
- strategic modelling is not a property-level noise survey.

### 3. Green-space access

Use the corrected ONS **Access to gardens and public green space in Great
Britain** workbook. It applies a common Ordnance Survey-based method across
England and Wales and contains LSOA-level measures including:

- average distance to the nearest park, public garden or playing field;
- combined green-space area within 1,000 metres;
- number of built-up-area postcodes;
- postcodes within 300 and 900 metres of green space.[^9]

Recommended green pillar:

```text
green_proximity =
    built_up_postcodes_within_300m / built_up_postcodes

green_provision =
    average combined park/garden/playing-field area within 1,000m

green_pillar =
    mean(
        national population percentile(green_proximity),
        national population percentile(green_provision)
    )
```

Using 300 metres follows the approximate five-minute-access concept used by
WIMD, while the provision term prevents a tiny nearby site from representing the
same environmental benefit as substantial surrounding green space.[^3]

This is the weakest source temporally. ONS published it in 2020, later corrected
the workbook, and confirmed in 2025 that it has no plans for a recurring
update.[^10] That does not prevent a reproducible current baseline, but the
factor must be described as a multi-period structural measure rather than “2026
conditions.”

A future version could replace it with a scripted England-and-Wales calculation
from OS Open Greenspace. That should not delay the first objective replacement.

### 4. Housing environmental quality

Use the 2025 LSOA mean Energy Performance Certificate Standard Assessment
Procedure score published as an underlying indicator by England and Wales.
Higher is better.

Both administrations impute missing EPCs using neighbouring properties of
similar type. Welsh Government deliberately selected the simpler MHCLG approach
because it provides consistency with England.[^11] This makes EPC substantially
safer for cross-border use than the “poor-quality housing” indicators.

Do **not** combine the headline English and Welsh poor-housing indicators:

- England's 2025 poor-condition indicator removed thermal comfort because EPC
  now covers it;
- the Welsh poor-quality indicator continues to include excess cold, falls,
  other serious hazards and disrepair;
- the disrepair criterion is similar, but the complete indicators and national
  benchmarking models are not identical.[^1][^11]

EPC is not a full building-maintenance survey. The public label should therefore
be “housing energy quality” or “housing environmental quality,” not “housing
condition.”

## Dereliction, vacancy and general deprivation

Dereliction should not be represented by an invented proxy merely because it
fits the intended story.

The most plausible common candidate is ONS Census 2021 “truly vacant dwellings,”
available for England and Wales at LSOA level. However, it is unsuitable for the
core score:

- it is a Census Day snapshot, not long-term vacancy;
- vacancy may reflect sale, refurbishment or turnover rather than neglect;
- some classifications are modelled;
- the census occurred during the pandemic;
- flats and Welsh-language addresses have particular address-matching
  limitations.[^12]

Recommended treatment:

- calculate vacancy during the pilot as a **sensitivity diagnostic**;
- do not weight it in version 1;
- retain a future “dereliction/long-term vacancy” slot only if a harmonised
  recurring small-area series becomes available;
- do not use total IMD/WIMD deprivation, property prices, council enforcement
  counts, litter complaints or OpenStreetMap tagging as substitutes.

## Calculation and geography

### Common geography

Reuse the reviewed April 2024 built-up-area mappings already maintained for
local transport, including the explicit Bournemouth–Poole and Torbay composites.
This preserves the project's settlement scope rather than falling back to
local-authority boundaries.

For each source:

1. Resolve the source geography to Census OAs or LSOAs.
2. Attach source observations to constituent 2021 OAs.
3. Join OAs to the existing April 2024 BUA lookup.
4. Aggregate using Census 2021 usual-resident population.
5. For composite locations, combine BUAs using the same population weighting.
6. Record covered and expected population independently for every pillar.

The older green-space data require a retained ONS 2011-to-2021 geography lookup.
Split areas should be apportioned using published lookup weights or constituent
OA population—not names, centroids or manual judgement. ONS itself warns that
best-fit areas can differ between OA- and LSOA-based datasets, so the boundary
approximation must be quantified.[^13]

Third-party GIS libraries are permitted for this workstream. Prefer an official
bulk lookup where it expresses the required relationship adequately; otherwise,
perform the spatial work reproducibly with `geopandas`, `pyogrio` and `shapely`.
In particular, an overlay or spatial join can assign current OAs to the 2011
green-space geography, and can associate Defra's 1 km pollution grid with the
population geography. Use `rasterio` only if a selected source is supplied as a
raster rather than as grid CSV or vector data.

Spatial operations must use a documented projected coordinate reference system,
validate and repair invalid geometries explicitly, state the boundary predicate,
and record unmatched, multiply matched and sliver features. Population—not
polygon area—remains the final aggregation weight. Geometry libraries remove the
need to implement GIS algorithms in the standard library; they do not remove the
need to retain and audit the geographic allocation decisions.

### Standardisation

For each pillar:

1. Calculate the raw observation for every April 2024 BUA in England and Wales,
   not merely the candidate locations.
2. Convert it to a 0–100 population-weighted national percentile, with 100 always
   meaning better residential conditions.
3. Average the four pillar percentiles:

   ```text
   residential_environment_0_100 =
       (air_percentile
        + quiet_percentile
        + green_percentile
        + housing_environment_percentile) / 4
   ```

4. Derive fixed population-weighted quintile thresholds from all
   England-and-Wales BUAs.
5. Assign the project factor score from 1 to 5 using those retained thresholds.

This mirrors the strong part of the existing local-transport design: a fixed
national reference rather than rankings among whichever candidates happen to be
present. Adding a location will therefore not change another location's
environmental score.

Do not:

- rank England and Wales separately;
- create quintiles from only the 83 candidates;
- fill missing pillars with zero;
- renormalise weights when a pillar is missing;
- parse narrative reasons to obtain scores.

If any pillar is missing, the environment factor and overall composite remain
blank. The release is not ready until all current locations have all four
pillars.

## Repository implementation plan

### 1. Write and freeze the method

Add `docs/residential-environment-methodology.md` before inspecting candidate
rankings. It should freeze:

- definition and exclusions;
- four equal pillar weights;
- exact source fields, units, periods and directions;
- WHO normalisation constants;
- geography allocation and population weights;
- national percentile and quintile rules;
- missing-data behaviour;
- refresh and supersession policy;
- known limitations.

This prevents outcome-driven weight adjustment.

### 2. Separate acquisition from transformation

Add:

- `scripts/acquire_residential_environment.py`: downloads only published
  artifacts, records exact URLs, request details, timestamps, MIME types,
  licences, sizes and SHA-256 hashes.
- `scripts/prepare_residential_environment.py`: offline parsing, GIS joins,
  aggregation, scoring and audit generation using pinned data-processing and GIS
  dependencies where they simplify or strengthen the work.

All observations are available as bulk datasets. Acquisition should use stable
HTTP download URLs or documented APIs and must never perform one browser workflow
per location. If an interactive download page obscures its endpoint, inspect the
request once and encode the resulting bulk request in the acquisition script.
Playwright is not part of the refresh method.

The preparer can produce reviewed canonical CSVs that `scripts/build.py` then
validates and consumes offline. Add a dedicated pinned dependency file, for
example `requirements-environment.txt`, containing what the preparation workflow
uses. The likely initial set is:

- `pandas` and `openpyxl` for tabular workbooks;
- `geopandas`, `pyogrio` and `shapely` for vector data and spatial joins;
- `rasterio` only if required by the chosen source format.

Document supported Python and library versions, installation, coordinate-system
requirements and the exact preparation command. A clean environment must be able
to reproduce the canonical candidate and audit outputs from retained raw files.

Retain the sources under a dated directory such as:

```text
data/raw/environment/2026-09-xx/
```

The raw manifest should cover:

- English IoD 2025 v2 underlying indicators;
- WIMD 2025 housing and physical-environment indicator downloads;
- Defra 2024 PCM files;
- corrected ONS green-space workbook;
- Census population and geography lookups;
- April 2024 BUA lookup already used by local transport.

### 3. Introduce purpose-specific canonical tables

Replace `condition.csv` with:

```text
data/inputs/residential_environment.csv
data/inputs/residential_environment_release.csv
```

Recommended location columns include:

```text
location_id
air_burden
no2_ug_m3
pm25_ug_m3
pm10_ug_m3
noise_exposed_pct
green_within_300m_pct
green_area_within_1000m_m2
epc_sap_mean
air_percentile
quiet_percentile
green_percentile
housing_environment_percentile
environment_index_0_100
national_percentile
score
population_covered
population_expected
method_version
confidence
reason
```

Per-pillar periods and evidence IDs should either be explicit columns or a
normalised companion observation table. A single shared `source_period` would
conceal important vintage differences and should not be used.

### 4. Generate a national reference audit

Retain or generate an audit row for every England-and-Wales BUA containing:

- four raw pillars;
- four percentiles;
- population and coverage;
- combined index;
- factor score;
- exclusion reason where applicable.

`residential_environment_release.csv` should retain the four national quintile
thresholds, reference BUA count, population total, equality rule and method
version.

### 5. Replace the scoring path

In `scripts/composite.py`:

- rename the factor key from `condition` to `residential_environment`;
- preserve its relative weight of 15 initially;
- delete `ASSESSMENT_SCORES['condition']`;
- consume the validated supplied 1–5 score.

In `scripts/build.py`:

- remove the condition enum validation;
- validate all raw bounds, evidence references, method IDs, coverage equality
  and score-threshold agreement;
- require each environment score to reproduce from its four pillars;
- keep row counts dynamic.

In the browser:

- replace “Local condition” with “Residential environment”;
- show the 0–100 index, national percentile and four raw pillar observations;
- describe each source period separately;
- remove editorial labels such as “Highest broad condition.”

### 6. Tests and acceptance gates

The release should fail unless:

- all 83 current locations have one environment row;
- every location resolves to the existing reviewed BUA components;
- covered population equals expected population for every pillar;
- every source artifact matches its recorded hash;
- all directions and units are correct;
- the four pillar percentiles reproduce the combined index;
- fixed quintile thresholds reproduce every 1–5 score;
- England and Wales use the same formula;
- adding a dummy candidate does not change existing scores;
- ties enter the same band;
- missing input produces a blank factor and composite.

Research QA before acceptance:

- compare English results with the English Living Environment domain and Welsh
  results with WIMD Physical Environment—but only within each country;
- review the five highest and lowest BUAs for every raw pillar;
- run leave-one-pillar-out sensitivity;
- move each pillar weight by ±10 percentage points and flag locations whose
  factor band changes by more than one;
- examine correlation with housing cost, crime and transport to identify
  accidental duplication, without tuning the method to reduce correlations;
- compare BUA aggregation with local-authority values as a boundary diagnostic,
  not as a replacement.

### 7. Documentation cleanup

The live repository contains 83 locations, while the earlier repository
orientation described 63. The current `condition.csv` still contains only 63
rows: 45 `mixed`, 15 `favourable`, three `highest`, and no observations for the
20 later locations. The replacement should cover all 83 in one release.

Update:

- `README.md`;
- `docs/methodology.md`;
- `docs/provenance.md`;
- `docs/TODO.md`;
- the old `ENV001`–`ENV005` evidence records whose coverage still describes 57
  English and six Welsh candidates.

## Delivery sequence

1. Freeze the methodology and release schema.
2. Build a 12-location stratified feasibility probe, including at least three
   Welsh locations, small/large BUAs, coastal/inland places and composite BUAs.
3. Implement the green-space and pollution geography joins with official lookups
   and pinned GIS libraries, then prove full population coverage.
4. Acquire and hash the complete releases.
5. Generate the all-BUA reference distribution.
6. Produce all 83 canonical observations in one run.
7. Perform sensitivity and outlier review.
8. Replace condition scoring, UI and documentation.
9. Run `python3 scripts/build.py` and the full unit-test suite.
10. Visually review the browser at desktop and narrow widths.
11. Accept only as a single coordinated change containing inputs, scripts, raw
    manifests, generated outputs, tests and documentation.

The 2011 green-space geography conversion remains an important validation gate,
but it is not expected to require manual or browser-based collection. If official
lookups plus reproducible GIS joins still cannot meet the declared coverage and
allocation checks, the correct response is to keep the environment factor blank
while developing an OS Open Greenspace successor—not to fall back to separate
English and Welsh deprivation ranks.

## Sources

[^1]: Ministry of Housing, Communities and Local Government, “[English Indices
    of Deprivation 2025: technical
    report](https://assets.publishing.service.gov.uk/media/68ff59c80f801e57b5bef907/ID_2025_Technical_Report.pdf),”
    30 October 2025.
[^2]: Ministry of Housing, Communities and Local Government, “[English Indices
    of Deprivation 2025: statistical
    release](https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025/english-indices-of-deprivation-2025-statistical-release),”
    updated 17 November 2025.
[^3]: Welsh Government, “[WIMD 2025 technical report: Physical Environment
    domain](https://www.gov.wales/welsh-index-multiple-deprivation-wimd-2025-technical-report-physical-environment-domain-html),”
    2025.
[^4]: Welsh Government, “[Welsh Index of Multiple Deprivation 2025:
    guidance](https://www.gov.wales/welsh-index-multiple-deprivation-wimd-2025-guidance-html),”
    2025.
[^5]: Department for Environment, Food & Rural Affairs, “[Modelled background
    pollution data](https://uk-air.defra.gov.uk/data/pcm-data),” UK-AIR.
[^6]: World Health Organization, “[WHO global air quality
    guidelines](https://www.who.int/publications/i/item/9789240034228/),” 22
    September 2021.
[^7]: Ministry of Housing, Communities and Local Government, “[English Indices
    of Deprivation 2025: underlying indicators and technical
    report](https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025),”
    2025.
[^8]: Welsh Government, “[WIMD 2025 Physical Environment indicator
    data](https://stats.gov.wales/en-GB/2f8dfe38-bfa8-4f61-bc34-1d84d470a940),”
    2025.
[^9]: Office for National Statistics, “[Access to gardens and public green space
    in Great
    Britain](https://www.ons.gov.uk/economy/environmentalaccounts/datasets/accesstogardensandpublicgreenspaceingreatbritain/accesstopublicparksandplayingfieldsgreatbritainapril2020),”
    corrected workbook, 2020–2022.
[^10]: Office for National Statistics, “[Access to gardens and green
    space](https://www.ons.gov.uk/aboutus/transparencyandgovernance/freedomofinformationfoi/accesstogardensandgreenspace),”
    FOI response, 21 November 2025.
[^11]: Welsh Government, “[WIMD 2025 technical report: Housing
    domain](https://www.gov.wales/welsh-index-multiple-deprivation-wimd-2025-technical-report-housing-domain-html),”
    2025; see also “[WIMD 2025 Housing indicator
    data](https://stats.gov.wales/en-GB/8c4e387a-d221-4a24-9fd4-50bdaacbe273).”
[^12]: Office for National Statistics, “[Number of vacant and second homes,
    England and Wales: Census
    2021](https://www.ons.gov.uk/peoplepopulationandcommunity/housing/bulletins/numberofvacantandsecondhomesenglandandwales/census2021),”
    27 October 2023.
[^13]: Office for National Statistics, “[Build a custom area
    profile](https://www.ons.gov.uk/visualisations/customprofiles),” methodology
    guidance.
