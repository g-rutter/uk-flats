# Local public-transport connectivity methodology

The local-transport factor is the Department for Transport (DfT) 2025
**Overall (public transport)** connectivity metric. It replaces the former
reviewer-assigned `basic_bus_rail`, `useful_bus_rail` and `dense_multimodal`
bands completely. National rail journeys to London and Birmingham remain a
separate factor.

## Measure and source release

DfT defines connectivity as the opportunity to reach employment, services and
social engagements. Its public-transport network combines walking access with
scheduled bus, rail, tram/light rail, Underground and ferry travel. The model
evaluates public transport at 10-minute intervals from 06:00 to 22:00 and
combines purposes and times using observed National Travel Survey preferences.

The retained `connectivity_metrics_2025.ods` is the first DfT release. The
selected OA field is exactly `Overall (public transport)`; other modes and
purpose-specific fields are not used. The source uses Q4 2024 transport and
destination data and provisional 2023 BRES employment data. Values run from 0
to 100 and higher values represent greater modelled connectivity.

This is a scheduled-opportunity measure. It does not measure fares, crowding,
cancellations, real-time reliability, personal security, step-free access,
cycling access, or the walk from a particular home. It is not labelled
transport quality or commutability in the interface.

## Settlement geography and population weights

Each screen location has a reviewed mapping in
`data/inputs/location_geographies.csv`; component codes are separate in
`data/inputs/location_geography_components.csv`. The implementation uses the
official Office for National Statistics (ONS) best-fit lookup from 2021 Output
Areas (OAs) to Built-up Areas (BUAs) as at 17 April 2024. A BUA represents the
physical footprint of a continuously built-up settlement, rather than a council
or other administrative boundary. This is the available official OA-to-2024-BUA
lookup and is recorded precisely rather than being described as the later
December 2024 boundary edition proposed during research.

Most locations map to one named BUA. Bournemouth–Poole is the population-
weighted combination of Bournemouth and Poole. Torbay combines Torquay,
Paignton and Brixham. There is no silent local-authority, radius or nearby-town
fallback.

The raw location value is:

```text
sum(OA DfT value × OA Census 2021 usual residents)
--------------------------------------------------
          sum(OA Census 2021 usual residents)
```

Every component BUA must have complete expected population coverage. The
preparer stops instead of treating a missing OA as zero. The current release
covers 100% of the expected population for all 83 locations. The canonical mean
retains four decimal places for score validation and is displayed to one decimal
place; calculations use the unrounded OA values.

## National benchmark and five-point score

The comparison benchmark is all 188,880 England and Wales OAs in the same DfT
release, weighted by 59,597,747 Census 2021 usual residents. It does not depend
on which locations happen to be on the screen. The population-weighted
thresholds are retained in `data/inputs/local_transport_release.csv`:

| Score | Unrounded DfT value |
| ---: | ---: |
| 1 | below 53.70 |
| 2 | 53.70 to below 64.39 |
| 3 | 64.39 to below 71.48 |
| 4 | 71.48 to below 79.48 |
| 5 | 79.48 or above |

A value exactly equal to a threshold enters the higher score band. The browser
shows the raw 0–100 value and national population percentile as the primary
evidence; the integer score is only a composite input with a relative weight of
15. Composite weights are normalised by their total, as described in the broad
comparison methodology.

## Reproduction and release controls

The dated raw release is
`data/raw/releases/2026-09-09-local-transport/`.
`manifest.csv` records source URLs, retrieval date, periods, limitations and
SHA-256 hashes for the DfT ODS, ONS OA-to-BUA lookup and Nomis Census TS001 OA
population ZIP. Reproduce the canonical and review tables offline with:

```sh
python3 scripts/prepare_local_transport.py \
  --canonical-output data/inputs/localTransport.csv
python3 scripts/build.py
python3 -m unittest discover -s tests
```

The preparer streams the large ODS with the Python standard library, validates
the exact metric, bounds, uniqueness, mappings, hashes and full population
coverage, then writes `data/derived/local_transport_review.csv` before the
canonical table. A refresh is atomic: replace the three artifacts and manifest,
update the explicit release constants after reviewing source definitions, run
the preparer for every location, and review changes before promotion. Never mix
editions or update one location independently.
