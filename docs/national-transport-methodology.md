# National transport acquisition methodology

## What the data means

This compares national-rail access from one reviewed National Rail station per broad candidate location to fixed London and Birmingham rail gateways. It is a dated, station-to-station National Rail Journey Planner observation—not a property, neighbourhood, walking, fare, accessibility, door-to-door or guaranteed journey measure. Timetables, disruption and planner routing can change results. It is separate from the qualitative `localTransport.csv` assessment; neither measure may be used to infer the other.

The source is National Rail's public Journey Planner service, as configured by the public [National Rail Journey Planner](https://www.nationalrail.co.uk/journey-planner/). The collector makes the same JSON journey request directly, using Python's standard library; it retains the exact request and returned response. This replaces browser automation: browser rendering has no evidential benefit once the request and the structured response are retained. The service is public but not a published stable API, so the endpoint, request shape and response fields must be revalidated before any later acquisition run. NaPTAN/NPTG may support station reference review, but is not a journey-time source.

## Endpoints and selection

Each origin requires a reviewed row in `data/inputs/transport_stations.csv`: CRS, station name, selection rationale, confidence and evidence IDs. Birmingham is Birmingham New Street (`BHM`). London is the planner's `London (All Stations)` group, represented in a direct request by its retained planner group identifier. Label this a London rail gateway, never central London.

For this release, the journey date is Friday 11 September 2026 and the local departure window is 10:00–14:00 (`2026-09-11T10:00:00+01:00` to `2026-09-11T14:00:00+01:00`). Collection may happen before that date: collection and retrieval timestamps are actual timestamps, not the planned journey date. Request 10:00, 11:00, 12:00 and 13:00 to cover the window.

Select the shortest elapsed suitable itinerary departing within the window from the retained response. A suitable itinerary is National Rail passenger service without an unreviewed bus, ferry, rail-replacement or other non-rail leg. Transfers between rail legs are allowed. `changes` is the number of passenger-service legs minus one, checked against the retained response rather than inferred from station names. If no suitable result is available, leave duration and changes blank and state why.

Where the retained responses cover it, count distinct suitable departures in a recorded two-hour local window as `usable_departures_in_window`. It is snapshot context, not general frequency; leave it blank when it cannot be counted reliably.

## Evidence, data and review

For every route retain each request JSON, response JSON and `capture-metadata.json`, sufficient to cover the selection window. The request records CRS/group flags, planned time and all routing options; the response contains the planner's scheduled times, duration and legs. A dated raw release includes a `manifest.csv` of artifact hashes, retrieval timestamps and limitations; `raw_capture_path` is relative to that release. Retain the measurement date, selection window, searches used, departure/arrival, elapsed minutes, changes, frequency context, confidence, evidence ID and reason. Blank means unknown/unavailable, never zero.

`scripts/collect_national_transport_http.py` acquires and retains raw request/response pairs only. `scripts/prepare_national_transport.py` is an offline standard-library validator/transformer: it checks the manifest, mappings and route fields and writes review staging output. Neither script updates `nationalTransport.csv`. Review station choices, unsuitable legs, missing or excluded routes, and anomalous durations/change counts before copying a complete reviewed release to canonical inputs. Retain an evidence-catalogue row with provider, coverage, period and limitations.

The existing UI fields (`londonMinutes`, `londonChanges`, `birminghamMinutes`, `birminghamChanges`) remain for compatibility. Initially, frequency is not a score factor. UI wording must identify displayed values as dated, station-to-station planner snapshots.
