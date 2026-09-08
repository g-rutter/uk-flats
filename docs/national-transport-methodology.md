# National transport acquisition methodology

## What the data means

This compares national-rail access from one reviewed National Rail station per broad candidate location to fixed London and Birmingham rail gateways. It is a dated, station-to-station National Rail Journey Planner observation—not a property, neighbourhood, walking, fare, accessibility, door-to-door or guaranteed journey measure. Timetables, disruption and planner routing can change results. It is separate from the qualitative `localTransport.csv` assessment; neither measure may be used to infer the other.

The canonical journey source is the public [National Rail Journey Planner](https://www.nationalrail.co.uk/journey-planner/), used manually in a browser. Record only what it visibly displays. NaPTAN/NPTG may support station reference review, but is not a journey-time source.

## Endpoints and selection

Each origin requires a reviewed row in `data/inputs/transport_stations.csv`: CRS, station name, selection rationale, confidence and evidence IDs. Birmingham is Birmingham New Street (`BHM`). London is the planner's visible `London (All Stations)` group: search `London`, choose that suggestion, and retain any planner-supplied group identifier. Label this a London rail gateway, never central London. Do not use `London Terminals`; it was not a visible suggestion in the recorded endpoint check.

For this release, the journey date is Friday 11 September 2026 and the local departure window is 10:00–14:00 (`2026-09-11T10:00:00+01:00` to `2026-09-11T14:00:00+01:00`). Collection may happen before that date: collection and retrieval timestamps are actual timestamps, not the planned journey date. Start at 10:00 and inspect later results; if needed to cover the window, search at 11:00, 12:00 and 13:00.

Choose the shortest elapsed *displayed suitable* itinerary departing within the window. A suitable itinerary is National Rail passenger service without an unreviewed bus, ferry, rail-replacement or other non-rail leg. Transfers shown as rail are allowed. `changes` is the displayed number of changes between passenger-service legs, not an inference from station names. If no suitable result is available, leave duration and changes blank and state why.

Where reliably visible, count distinct suitable departures in a recorded two-hour local window as `usable_departures_in_window`. It is snapshot context, not general frequency; leave it blank when it cannot be counted reliably.

## Evidence, data and review

For every route retain a result capture, expanded journey details, result URL when supplied, and a transcription in `data/inputs/transport_route_observations.csv`. A dated raw release includes a `manifest.csv` of visible query values, capture hashes, timestamps and limitations; `raw_capture_path` is relative to that release. Retain the measurement date, selection window, searches used, departure/arrival, elapsed minutes, changes, frequency context, confidence, evidence ID and reason. Blank means unknown/unavailable, never zero.

`scripts/prepare_national_transport.py` is an offline standard-library validator/transformer: it checks the manifest, mappings and route fields and writes review staging output. It never requests the planner or updates `nationalTransport.csv`. Review station choices, missing or excluded routes, and anomalous durations/change counts before copying a complete reviewed release to canonical inputs. Retain an evidence-catalogue row with provider, coverage, period and limitations.

The existing UI fields (`londonMinutes`, `londonChanges`, `birminghamMinutes`, `birminghamChanges`) remain for compatibility. Initially, frequency is not a score factor. UI wording must identify displayed values as dated, station-to-station planner snapshots.
