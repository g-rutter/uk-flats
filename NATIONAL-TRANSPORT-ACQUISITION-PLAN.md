# National transport acquisition plan

Replace the imported national-rail figures with a dated, reviewable station-to-station comparison for every broad-screen location. This workstream does not change the local-transport assessment. Definitions, fields, evidence requirements and interpretation are in [`docs/national-transport-methodology.md`](docs/national-transport-methodology.md).

## Current state — 8 September 2026

- The collection workflow is implemented: a standard-library queue generator, direct National Rail Journey Planner request/response collector, offline manifest finalizer and review-only preparer. A single Cardiff Central to Birmingham New Street direct request was validated on 8 September 2026 (HTTP 200 with structured itineraries); this was a method test only, not a release-wide run. See the [runbook](docs/national-transport-runbook.md).
- Twelve pilot origins have reviewed, evidence-linked station mappings: Barnsley, Bangor, Birmingham, Brighton & Hove, Cardiff, Leeds, Liverpool, Manchester, Newcastle upon Tyne, Reading, Wolverhampton and Wrexham.
- Raw pilot result captures are in progress. Barnsley to the London all-stations group, Cardiff Central to Birmingham New Street, and Bangor (Gwynedd) to Birmingham New Street have complete 10:00–14:00 result sets and selected details; other retained captures still require route-level review, details capture, manifest finalisation or completion of the window.
- No value in `data/inputs/nationalTransport.csv`, scoring or public transport comparison has changed. `transport_route_observations.csv` is review-only evidence, not a canonical replacement.

## Collection workflow

1. Review and evidence-link one origin station per location in `data/inputs/transport_stations.csv`.
2. Use the direct collector with reviewed CRS values and group flags. It retains the exact JSON request and returned response; do not rely on a browser-rendered result page.
3. Query the agreed date/window at the four stated times. Review retained itinerary legs and select the shortest suitable rail itinerary, recording calculated changes and any exclusions.
4. Put request, response and metadata captures in a dated raw release; hash and list them in `manifest.csv`. Transcribe values supported by the retained response to `data/inputs/transport_route_observations.csv`, including actual query and retrieval times and an explicit reason for blanks.
5. Run `python3 scripts/prepare_national_transport.py` on the release. It validates the manifest, timestamps, station mappings and transcription, and creates review-only staging CSVs; it neither browses nor updates canonical transport inputs.
6. Review mappings, missing/excluded routes, anomalous duration/change counts and a sample of captures. Add an evidence-catalogue row. Only then update canonical inputs, rebuild and test.

## Rollout

First complete a 12-location pilot covering direct and interchange-heavy routes, London-adjacent places, Wales, North East, North West, Yorkshire and West Midlands. Compare it with imported values without forcing agreement. Proceed to both routes for all locations only after that review; do not hard-code a location count. Keep scoring unchanged initially; frequency is context only. A later release may add contextual source/date/station wording to the Rail connections panel, but must not present the figures as door-to-door or guaranteed journeys.

If the public planner becomes impractical, seek approval before evaluating the licensed RTJP service or another provider. Do not build a CIF/OpenTripPlanner router for this task.
