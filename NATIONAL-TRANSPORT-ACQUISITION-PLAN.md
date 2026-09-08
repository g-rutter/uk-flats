# National transport acquisition plan

Replace the imported national-rail figures with a dated, reviewable station-to-station comparison for every broad-screen location. This workstream does not change the local-transport assessment. Definitions, fields, evidence requirements and interpretation are in [`docs/national-transport-methodology.md`](docs/national-transport-methodology.md).

## Current state — 8 September 2026

- The methodology, empty station/observation inputs, offline preparation script and validation tests are in place. No canonical journey value has changed.
- A headless browser capability check confirmed that the public planner accepts visible station selections. Collection uses the visible public interface only; do not scrape, call undocumented endpoints or construct planner URLs.
- One retained, review-only pilot observation exists: Barnsley (`BNY`) to Birmingham New Street (`BHM`) on 11 September 2026, 11:44–13:28, 104 minutes, one change at Sheffield. It has two train-service legs. It is not canonical.

## Collection workflow

1. Review and evidence-link one origin station per location in `data/inputs/transport_stations.csv`.
2. In a named, headless Playwright session, use the visible National Rail Journey Planner controls. Take fresh accessibility snapshots after page changes; select the visible CRS-labelled origin/destination suggestion; use a headed browser only to diagnose a headless failure and record the exception.
3. Query the agreed date/window and inspect later journeys as required by the methodology. Capture the selected displayed itinerary and its expanded details, including legs and changes. Start each route from a fresh form state.
4. Put captures in a dated raw release; hash and list them in `manifest.csv`. Transcribe only displayed values to `data/inputs/transport_route_observations.csv`, including actual query and retrieval times, URL if supplied, and an explicit reason for blanks.
5. Run `python3 scripts/prepare_national_transport.py` on the release. It validates the manifest, timestamps, station mappings and transcription, and creates review-only staging CSVs; it neither browses nor updates canonical transport inputs.
6. Review mappings, missing/excluded routes, anomalous duration/change counts and a sample of captures. Add an evidence-catalogue row. Only then update canonical inputs, rebuild and test.

## Rollout

First complete a 12-location pilot covering direct and interchange-heavy routes, London-adjacent places, Wales, North East, North West, Yorkshire and West Midlands. Compare it with imported values without forcing agreement. Proceed to both routes for all locations only after that review; do not hard-code a location count. Keep scoring unchanged initially; frequency is context only. A later release may add contextual source/date/station wording to the Rail connections panel, but must not present the figures as door-to-door or guaranteed journeys.

If the public planner becomes impractical, seek approval before evaluating the licensed RTJP service or another provider. Do not build a CIF/OpenTripPlanner router for this task.
