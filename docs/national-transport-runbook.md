# National transport collection runbook

This runbook operationalises the [national transport methodology](national-transport-methodology.md). It captures the JSON request and response from National Rail's public Journey Planner service with the Python standard library. It does not use a browser, parse page markup, or update canonical inputs.

## Prepare work

Create a dated release and an explicit route queue. The queue derives every location from `locations.csv`, flags unreviewed station mappings as `blocked-mapping`, and treats Birmingham New Street to itself as a documented degenerate route rather than inventing a zero-minute value. It is a work list for the direct collector, not browser-automation instructions.

```sh
python3 scripts/create_national_transport_queue.py \
  --out data/raw/releases/YYYY-MM-DD-national-transport/collection-queue.csv
```

Review one origin station per location first. Do not collect routes for a `blocked-mapping` queue row.

## Capture a route

For each route, retain searches at 10:00, 11:00, 12:00 and 13:00. The collector writes immutable request and response JSON pairs plus metadata. It refuses to overwrite any retained artifact. Revalidate the endpoint and request shape with one explicit validation capture before starting a new release-wide run.

```sh
python3 scripts/collect_national_transport_http.py \
  --out-dir data/raw/releases/YYYY-MM-DD-national-transport/transport/example__birmingham \
  --origin-crs EXM \
  --destination-crs BHM
```

For the London rail gateway use the reviewed group CRS/identifier and pass `--destination-group`; retain that identifier in the request JSON. Restrict a validation capture to one explicit search with `--search-time 10:00`. Do not treat a successful response for one route as authority to run the rest of the queue.

Review the response JSON across the whole 10:00–14:00 window. Select the shortest returned National Rail Journey Planner itinerary; do not exclude an itinerary based on its public-transport mode. Record scheduled departure and arrival, elapsed minutes and returned-leg changes, and frequency context only where directly supported by the retained response.

## Finalise and review

Add every retained request, response and metadata artifact to a `manifest-draft.csv` with these columns:

```text
relative_path,original_url,request_query,retrieved_at,data_period,publisher,licence_or_terms,coverage_limitations
```

Use `https://jpservices.nationalrail.co.uk/journey-planner` as `original_url`; describe the exact CRS, group flags and local planned time in `request_query`. Then hash the release without overwriting a retained manifest:

```sh
python3 scripts/finalize_national_transport_release.py \
  --release data/raw/releases/YYYY-MM-DD-national-transport \
  --draft data/raw/releases/YYYY-MM-DD-national-transport/manifest-draft.csv
```

Only after review, transcribe the observations and run `prepare_national_transport.py`. That writes review staging only; do not copy values into `nationalTransport.csv`, rebuild, or change scoring until the complete release, mappings, anomalies and evidence-catalogue row are approved.
