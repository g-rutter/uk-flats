# National transport collection runbook

This runbook operationalises the [acquisition plan](../NATIONAL-TRANSPORT-ACQUISITION-PLAN.md). The collector drives the public National Rail Journey Planner through rendered browser controls in a named headless session. It does not request undocumented endpoints, inspect network traffic, construct planner result URLs or machine-read itinerary data.

## Prepare work

Create a dated release and an explicit route queue. The queue derives every location from `locations.csv`, flags unreviewed station mappings as `blocked-mapping`, and treats Birmingham New Street to itself as a documented degenerate route rather than inventing a zero-minute value.

```sh
python3 scripts/create_national_transport_queue.py \
  --out data/raw/releases/YYYY-MM-DD-national-transport/collection-queue.csv
```

Review one origin station per location first. A collector selects only the visible CRS-labelled suggestion and records its exact label, selection rationale, confidence and evidence ID. Do not collect routes for a `blocked-mapping` queue row.

## Capture a route

For each route, use a fresh form state and retain the visible results from 10:00, 11:00, 12:00 and 13:00. The command below captures the form state, result accessibility snapshot and PNG for each requested search. It deselects the optional Booking.com checkbox so the Journey Planner result remains the active tab.

```sh
python3 scripts/collect_national_transport_ui.py \
  --session national-transport-YYYYMMDD-slice \
  --out-dir data/raw/releases/YYYY-MM-DD-national-transport/transport/example__london \
  --origin-option 'Example (EXM)' \
  --destination-option 'London (All Stations)'
```

The option arguments must exactly match visible suggestions. The script derives a search query by removing only a trailing CRS suffix. It saves `capture-metadata.json`, which records real retrieval timestamps and the result URL returned by the UI. It deliberately does not decide which itinerary is shortest or suitable.

Review the result captures across the whole 10:00–14:00 window. Select the shortest displayed suitable passenger-rail itinerary, capture its expanded Journey Details, and record any non-rail exclusion. Count frequency only if a distinct two-hour window can be read reliably.

## Finalise and review

Add every retained evidence artifact to a `manifest-draft.csv` with these columns:

```text
relative_path,original_url,request_query,retrieved_at,data_period,publisher,licence_or_terms,coverage_limitations
```

Then hash it without overwriting a retained manifest:

```sh
python3 scripts/finalize_national_transport_release.py \
  --release data/raw/releases/YYYY-MM-DD-national-transport \
  --draft data/raw/releases/YYYY-MM-DD-national-transport/manifest-draft.csv
```

Only after human review, transcribe the displayed observations and run `prepare_national_transport.py`. That writes review staging only; do not copy values into `nationalTransport.csv`, rebuild, or change scoring until the complete release, mappings, anomalies and evidence-catalogue row are approved.
