# Residential-environment methodology

Status: frozen research method, not yet used by the live screen while the
remaining research quality assurance and live integration are completed. Method
version: `residential-environment-bua24-v3-country-calibrated`.

## Definition and exclusions

Residential environment measures the population-weighted quality of everyday
physical surroundings across each reviewed April 2024 built-up area (BUA):
cleaner air, less transport noise, convenient public green space and housing
energy quality. It is not a property, street or neighbourhood assessment.
A BUA represents the physical footprint of a continuously built-up settlement,
rather than a council or other administrative boundary.

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
| Green-space access | Equal mean of the national percentiles for OA21 population-weighted centroids within 300 m of an eligible polygon and eligible polygon area within 1,000 m of each centroid | Higher is better; OS Open Greenspace April 2026 snapshot; `Public Park Or Garden` and `Playing Field` only |
| Housing environmental quality | Published Lower-layer Super Output Area (LSOA) Energy Performance Certificate (EPC) Standard Assessment Procedure (SAP) observation from the 2025 English Indices of Deprivation (IoD) or Welsh Index of Multiple Deprivation (WIMD) housing indicator | Higher is better; EPC records cover 2012–2024 |

The raw pollutant concentrations, noise percentage, green proximity and area,
and EPC observation must be retained alongside all derived values.

## Sources and compatibility gates

Exact artifact URLs, request details, retrieval timestamps, periods, publishers,
licences, sizes and SHA-256 hashes are retained in
`data/raw/environment/2026-09-09/manifest.csv`. Preparation is offline and first
verifies every manifest hash.

The acquisition script discovers the current `OpenGreenspace` product version
through the unauthenticated OS Downloads API and selects exactly one GB-wide
GeoPackage. The retained product metadata records version `2026-04`; the bulk
ZIP and metadata response are both hash-pinned. Product inclusion is the
eligibility rule and does not guarantee unrestricted public access.

The supported runtime is the repository baseline of Python 3.9 or later with
the exact packages in `requirements-environment.txt`. A clean checkout can use:

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements-environment.txt
.venv/bin/python scripts/prepare_residential_environment.py
```

Two cross-country differences prevent the raw observations from being described
as harmonised:

- the English noise indicator includes major-airport noise in addition to road
  and rail, while the Welsh indicator is road and rail;
- England publishes a shrunk deprivation transform of mean SAP. The pilot
  reverses its direction as `100 - published score`, which is not an exact
  unshrunk mean. Wales publishes a rounded mean SAP score.

The 2026-09-10 compatibility review found no complete published path to reverse
those differences. Version 3 therefore uses an explicit approximate ordinal
transform: quiet and housing observations become population-weighted percentiles
within their recorded country before being combined with air and green. This
removes genuine country-level distribution differences as well as source effects,
so it is not described as raw-value harmonisation. The raw observations remain
visible, and the generated migration audit and interpretation are documented in
`data/derived/residential_environment_compatibility_audit.csv` and
`docs/residential-environment-compatibility.md`.

## Geography and aggregation

The settlement geography is the reviewed April 2024 BUA mapping already used by
local transport. Bournemouth–Poole and Torbay retain their reviewed composite
components. Candidate counts are dynamic.

- Census 2021 Output Area (OA) usual residents supply final aggregation weights.
- Defra grid values are assigned using the OA21 population-weighted centroid in
  British National Grid (EPSG:27700). The containing 1 km cell is preferred. A
  nearest populated cell within five grid cells is allowed only when the
  containing coastal cell is absent; the fallback count is retained.
- English and Welsh 2025 noise and EPC observations are attached through the
  official exact-fit OA21-to-LSOA21 lookup.
- Ordnance Survey (OS) Open Greenspace is processed in British National Grid
  (EPSG:27700). Only
  `Public Park Or Garden` and `Playing Field` site polygons are retained; access
  points are not used. Duplicate IDs may be collapsed only when their function
  and geometry agree; conflicting duplicates fail preparation. Exact duplicate
  and overlapping geometry is counted once by unioning all eligible polygons.
- Invalid eligible geometry is repaired with Shapely `make_valid`; any empty
  polygonal result fails preparation. For each OA21 population-weighted
  centroid, nearest straight-line distance is measured to the union, with
  distance `<= 300` metres counted as within. Provision is the area of that
  union intersecting a 1,000-metre GEOS buffer (`quad_segs=32`). Boundary-only
  intersections contribute zero area and origins inside or on a site have zero
  distance.
- Each BUA pillar is the Census 2021 population-weighted mean of its constituent
  OA observations. Composite locations are combined with the same population
  weighting.

Covered and expected 2021 population are recorded independently for every
pillar. Release requires equality for every pillar and candidate component.
The v3 preparation covers 177,643 populated OA origins in 7,070 BUAs without an
unmatched green origin. All four pillars cover the full expected population of
all 83 candidates. The release CSV retains source-feature, duplicate, repair,
union, predicate and coverage audit counts. The national audit records the
standardisation country used for every BUA.

## National reference and score

Raw pillar values are calculated for every April 2024 BUA in England and Wales
with complete coverage. Air and both green components become 0–100
population-weighted percentiles against the combined national BUA distribution.
Quiet and housing become 0–100 population-weighted percentiles within England or
Wales to approximately align the incompatible published scales. Cross-border
BUAs use the country containing the majority of their Census 2021 population.
In every case 100 means the better environment and equal raw values receive the
same inclusive percentile.

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

The migration audit records the effect of adopting country calibration:
quiet-only calibration changes no candidate band, housing-only changes six, and
calibrating both changes seven; no candidate changes by more than one band.

## Refresh and supersession

A refresh is a new dated raw directory and release ID; retained releases are
immutable. The acquisition script may download only official bulk artifacts and
must record a new manifest. The preparer must run offline with the versions in
`requirements-environment.txt`. Never update a single candidate in isolation.

Use the latest common completed Defra year and compatible complete national
noise/EPC releases. Each refresh uses the latest complete OS Open Greenspace
snapshot available on the acquisition date and recalculates every national BUA;
never update one OA, BUA or candidate in isolation. The rejected ONS 2020
green-space workbook and its 2011 allocation inputs are not supported sources
and are not retained.
