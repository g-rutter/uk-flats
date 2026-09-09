# Residential-environment methodology

Status: frozen pilot method, not yet used by the live screen. Method version:
`residential-environment-bua24-v1`.

## Definition and exclusions

Residential environment measures the population-weighted quality of everyday
physical surroundings across each reviewed April 2024 built-up area (BUA):
cleaner air, less transport noise, convenient public green space and housing
energy quality. It is not a property, street or neighbourhood assessment.

It excludes crime and perceived safety; housing cost and wealth; employment;
transport and service access; schools, retail, culture and nightlife;
architectural taste and reputation; flood and collision risk; and general
deprivation. These either belong to another screen factor or do not have a
compatible objective England-and-Wales observation for this definition.

## Frozen pillars

The four pillars have equal 25% weight. A missing pillar makes the environment
index, factor score and overall composite unknown; missing observations are
never zero-filled and the remaining weights are never renormalised.

| Pillar | Raw observation | Direction and period |
| --- | --- | --- |
| Clean air | Mean of annual NO2/10, PM2.5/5 and PM10/15 concentrations from the Defra 1 km background grids | Lower is better; 2024 annual mean; concentrations are µg/m³ and divisors are the WHO 2021 annual guidelines |
| Quiet surroundings | Percentage of residents exposed to modelled transport noise of at least 55 dB Lden, from the 2025 English IoD or WIMD underlying indicator | Lower is better; the model uses Census 2021 population and strategic noise mapping |
| Green-space access | Equal mean of the national percentiles for built-up postcodes within 300 m of a park, public garden or playing field and average combined area of those sites within 1,000 m | Higher is better; ONS 2020 structural baseline, corrected workbook published in 2022 |
| Housing environmental quality | Published LSOA EPC SAP observation from the 2025 English IoD or WIMD housing indicator | Higher is better; EPC records cover 2012–2024 |

The raw pollutant concentrations, noise percentage, green proximity and area,
and EPC observation must be retained alongside all derived values.

## Sources and compatibility gates

Exact artifact URLs, request details, retrieval timestamps, periods, publishers,
licences, sizes and SHA-256 hashes are retained in
`data/raw/environment/2026-09-09/manifest.csv`. Preparation is offline and first
verifies every manifest hash.

The supported runtime is the repository baseline of Python 3.9 or later with
the exact packages in `requirements-environment.txt`. A clean checkout can use:

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements-environment.txt
.venv/bin/python scripts/prepare_residential_environment.py
```

Two cross-country differences require an explicit release decision and remain
visible rather than being described as harmonised:

- the English noise indicator includes major-airport noise in addition to road
  and rail, while the Welsh indicator is road and rail;
- England publishes a shrunk deprivation transform of mean SAP. The pilot
  reverses its direction as `100 - published score`, which is not an exact
  unshrunk mean. Wales publishes a rounded mean SAP score.

Until those differences are accepted as sufficiently compatible or replaced by
harmonised observations, the new factor must not replace local condition.

## Geography and aggregation

The settlement geography is the reviewed April 2024 BUA mapping already used by
local transport. Bournemouth–Poole and Torbay retain their reviewed composite
components. Candidate counts are dynamic.

- Census 2021 OA usual residents supply final aggregation weights.
- Defra grid values are assigned using the OA21 population-weighted centroid in
  British National Grid (EPSG:27700). The containing 1 km cell is preferred. A
  nearest populated cell within five grid cells is allowed only when the
  containing coastal cell is absent; the fallback count is retained.
- English and Welsh 2025 noise and EPC observations are attached through the
  official exact-fit OA21-to-LSOA21 lookup.
- The ONS green-space workbook uses 2011 LSOAs. Its values are allocated to
  OA21s through the official OA11-to-OA21 change lookup and OA11-to-LSOA11
  lookup, weighted by Census 2011 OA usual residents. No name, centroid or
  polygon-area allocation is used.
- Each BUA pillar is the Census 2021 population-weighted mean of its constituent
  OA observations. Composite locations are combined with the same population
  weighting.

Covered and expected 2021 population are recorded independently for every
pillar. Release requires equality for every pillar and candidate component.
The 2020 workbook is restricted to residential urban postcodes. Where an older
LSOA has no published row but one of its OAs falls within a 2024 BUA, the pilot
correctly reports missing coverage; it does not borrow a neighbouring value.

## National reference and score

Raw pillar values are calculated for every April 2024 BUA in England and Wales
with complete coverage. Each becomes a 0–100 population-weighted percentile
against that combined national BUA distribution, with 100 always meaning the
better environment. Equal raw values receive the same inclusive percentile.

```text
green_percentile = mean(
    percentile(green_within_300m_pct),
    percentile(green_area_within_1000m_m2)
)

environment_index_0_100 = mean(
    air_percentile,
    quiet_percentile,
    green_percentile,
    housing_environment_percentile
)
```

The environment index receives its own national population-weighted percentile.
Four fixed population-weighted quintile thresholds from all complete England-
and-Wales BUAs produce the 1–5 factor score. A value equal to a threshold enters
the higher band. Adding or removing a project candidate cannot change the
reference distribution or another candidate's score.

## Validation and release gates

The preparer must fail unless all current candidates resolve to reviewed BUA
components and all four covered populations equal expected population. Before
switching the live factor, the retained outputs must also demonstrate:

- hash-valid raw artifacts and exact source fields, directions and units;
- reproducible pillar percentiles, combined index, thresholds and score;
- identical formulas in England and Wales;
- stable scores when a dummy candidate is added and consistent tie handling;
- blank factor and composite results for missing input;
- reviewed highest and lowest BUAs for every raw pillar;
- leave-one-pillar-out and ±10 percentage-point weight sensitivity;
- correlations with housing cost, crime and transport;
- within-country comparison with the English Living Environment and WIMD
  Physical Environment domains, used only as validation rather than inputs.

## Refresh and supersession

A refresh is a new dated raw directory and release ID; retained releases are
immutable. The acquisition script may download only official bulk artifacts and
must record a new manifest. The preparer must run offline with the versions in
`requirements-environment.txt`. Never update a single candidate in isolation.

Use the latest common completed Defra year and compatible complete national
noise/EPC releases. The non-recurring ONS green-space workbook remains a clearly
labelled structural baseline until a scripted England-and-Wales replacement,
preferably from OS Open Greenspace, passes the same coverage and audit gates.
