# National transport acquisition plan

Replace the imported national-rail figures with a dated, reviewable station-to-station comparison for every broad-screen location. This workstream does not change the local-transport assessment. Definitions, fields, evidence requirements and interpretation are in [`docs/national-transport-methodology.md`](docs/national-transport-methodology.md).

## Current state — 8 September 2026

- The collection workflow is implemented: a standard-library queue generator, direct National Rail Journey Planner request/response collector, offline manifest finalizer and review-only preparer. See the [runbook](docs/national-transport-runbook.md).
- Twelve pilot origins have reviewed, evidence-linked station mappings: Barnsley, Bangor, Birmingham, Brighton & Hove, Cardiff, Leeds, Liverpool, Manchester, Newcastle upon Tyne, Reading, Wolverhampton and Wrexham.
- The direct pilot raw release is complete: 23 eligible routes have four retained searches each, 207 retained request/response/metadata artifacts and a hash-verified manifest. Its review-stage observations are in `data/inputs/transport_route_observations_direct_pilot.csv`; all 23 routes have a reviewed National Rail Journey Planner itinerary. Birmingham New Street–Birmingham New Street is the explicit 0-minute, 0-change self-route.
- No value in `data/inputs/nationalTransport.csv`, scoring or public transport comparison has changed. Both route-observation files are review-only evidence, not canonical replacements.

## Collection workflow

1. Review and evidence-link one origin station per location in `data/inputs/transport_stations.csv`.
2. Use the direct collector with reviewed CRS values and group flags. It retains the exact JSON request and returned response; do not rely on a browser-rendered result page.
3. Query the agreed date/window at the four stated times. Review retained itinerary legs and select the shortest returned planner itinerary without a mode-based filter, recording calculated changes and any unavailable route.
4. Put request, response and metadata captures in a dated raw release; hash and list them in `manifest.csv`. Transcribe values supported by the retained response to `data/inputs/transport_route_observations.csv`, including actual query and retrieval times and an explicit reason for blanks.
5. Run `python3 scripts/prepare_national_transport.py` on the release. It validates the manifest, timestamps, station mappings and transcription, and creates review-only staging CSVs; it neither browses nor updates canonical transport inputs.
6. Review mappings, missing/excluded routes, anomalous duration/change counts and a sample of captures. Add an evidence-catalogue row. Only then update canonical inputs, rebuild and test.

## Rollout

First complete a 12-location pilot covering direct and interchange-heavy routes, London-adjacent places, Wales, North East, North West, Yorkshire and West Midlands. Compare it with imported values without forcing agreement. Proceed to both routes for all locations only after that review; do not hard-code a location count. Keep scoring unchanged initially; frequency is context only. A later release may add contextual source/date/station wording to the Rail connections panel, but must not present the figures as door-to-door or guaranteed journeys.

If the public planner becomes impractical, seek approval before evaluating the licensed RTJP service or another provider. Do not build a CIF/OpenTripPlanner router for this task.
