# National transport acquisition plan

## Progress update — 8 September 2026

Preparation is complete, but no canonical journey values have been replaced and
no planner observations have been transcribed yet.

- Added `docs/national-transport-methodology.md`, including the distinction
  between the **collection date** (the actual query/retrieval timestamp) and
  the planned **journey date** of 11 September 2026. A future journey can be
  planned today; 11 September is not a requirement to wait before querying.
- Added header-only, intentionally unreviewed inputs:
  `data/inputs/transport_stations.csv` and
  `data/inputs/transport_route_observations.csv`. They contain no invented
  station mappings or route observations.
- Added `scripts/prepare_national_transport.py`. It makes no network requests;
  it validates a manual transcription against a hashed raw-release manifest,
  verifies timestamps, elapsed time, selection window, station mapping and
  capture references, then writes review-only long and pivoted staging CSVs.
- Added build validation for the two new input schemas and a regression test of
  the preparer. `python3 scripts/build.py` and
  `python3 -m unittest discover -s tests` passed on 8 September 2026 (28 tests).
- Installed the Codex Playwright skill and verified its headed real-browser
  workflow against the public planner on 8 September 2026. It opened the form,
  handled the consent dialog, accepted an origin search, and exposed the
  official `Barnsley (BNY)` station suggestion. This was a capability check:
  no journey query was submitted and no observation was recorded.
- Completed one headless end-to-end pilot observation: Barnsley (`BNY`) to
  Birmingham New Street (`BHM`), journey date 11 September 2026. The shortest
  displayed suitable itinerary departing in the 10:00--14:00 window was 11:44
  to 13:28, **104 minutes and one change** (at Sheffield). The public planner's
  expanded Journey Details showed two `Train Service` legs. The selected-route
  and journey-details screenshots, manifest, station mapping, long-form
  transcription and evidence-catalogue row are retained. It is pilot evidence,
  not a canonical replacement: Barnsley's London route and the other pilot
  places remain to be collected and reviewed.

The remaining pilot collection can use the controlled browser procedure below.
The existing imported `nationalTransport.csv` remains deliberately unchanged
until retained observations pass review.

## Purpose

Replace the current imported, rounded representative national-rail figures with
a dated, repeatable comparison of candidate locations' rail access to London and
Birmingham. This is the **national transport** workstream. It is distinct from
the project's local-transport assessment, which concerns broad bus and rail
coverage within a town or city.

The scope remains the project's broad locations (currently 83), not
neighbourhoods, properties or individual listings.

This plan deliberately starts with rail station-to-station journeys. It does not
claim to measure door-to-door travel from an unknown future flat. Walking may be
shown separately only when its endpoints are explicit.

## Recommended source and method

Use the public National Rail Journey Planner as the initial canonical itinerary
source. It is free to use in a browser and is the official public interface for
entering a starting station, destination and preferred travel date/time, then
viewing route options. Collect a limited, dated research snapshot by browsing
the planner; do not scrape it or depend on its undocumented browser requests.

Source documentation:

- National Rail, [Journey Planner](https://www.nationalrail.co.uk/journey-planner/) and [guide to using it](https://www.nationalrail.co.uk/help-and-assistance/how-to-use-the-journey-planner/).
- DfT, [NaPTAN and NPTG API](https://www.api.gov.uk/dft/national-public-transport-access-nodes-naptan-and-national-public-transport-gazetteer-nptg-api/), for publicly documented stop/station reference data where needed.

Agents can make the required searches and record the original displayed data.
For each result, retain the planner URL if available, a page capture or
screenshot, and a structured transcription. This is a one-off evidence
collection task, not a live journey-planning feature.

Do not construct a national rail router from Network Rail CIF schedules in this
project: parsing timetable variations, interchanges and routing rules would
create substantial work and a lower-level system to maintain. The formal RTJP
webservice remains an optional future route for automated refreshes, but it is
licensed and charged at cost recovery, so is not needed for the initial run.

## Controlled browser collection procedure

Use Codex's installed `playwright` skill and its `playwright-cli` wrapper to
operate the public Journey Planner in an isolated **headless real browser** by
default. This avoids opening, focusing or otherwise disrupting the user's
normal browser windows. Use a headed browser only to diagnose an interaction
that the headless run cannot complete, and record that exception in the release
limitations. This replaces the former lack of an interactive browser capability;
it does not authorise scraping, direct HTTP requests, inspection of
undocumented network calls, or use of planner internals.

For each visible planner session:

1. Open the public Journey Planner headlessly; take a fresh accessibility snapshot
   before each interaction and after every material page change.
2. Handle the consent dialog if shown, open `Plan a Journey`, and enter the
   reviewed origin and fixed destination through the visible station controls.
   Select the exact visible station/group suggestion; do not rely on text entry
   alone or construct query URLs.
3. Set the journey date, departure mode and time through the visible controls.
   Submit the query, inspect the displayed options and use the visible “later”
   results control as required by the selection rule.
4. Capture the actual displayed result page using the browser screenshot
   facility. Retain the capture under the dated raw release, record the current
   page URL when the site supplies one, and transcribe only the visible selected
   itinerary and frequency-context data.
5. Record the actual local query and retrieval timestamps, then start the next
   route from a fresh visible form state. Do not use browser `eval`, direct
   network tools, hidden fields or undocumented page requests to obtain data.

Playwright's role-based visible controls and fresh snapshots make the selection
auditable, while the raw screenshot, manifest and transcription remain the
evidence of record. A successful form interaction is not itself an observation:
only a retained result capture and matching transcription may enter the review
staging process.

### Agent hand-off notes from the first headless route

- Use a named Playwright session for this workstream. It isolates the headless
  browser from the user's ordinary browsing. Do not open a headed browser unless
  the headless flow genuinely fails.
- The first visit can show a cookie dialog. Rejecting it permits the planner
  form to open. Take a fresh accessibility snapshot after dismissing it, after
  opening the form, after each station selection, and after submitting the
  query; element references are invalidated by those changes.
- Select the visible CRS-labelled suggestion rather than leaving typed text in
  either station box. The initial Barnsley check resolved `BNY` to the exact
  `Barnsley (BNY)` option, and `BHM` to `Birmingham New Street (BHM)`.
- A 10:00 query displayed ten initial results through 13:42. One visible
  `View later trains` action then exposed the next 14:12 departure, proving
  coverage beyond the 14:00 endpoint. Do not assume the first option is fastest:
  this route's selected 104-minute journey was the fifth displayed option.
- Expand the selected duration before recording it. The Journey Details modal
  names each transfer and labels leg modes (here, two `Train Service` legs via
  Sheffield), which is the check against rail-replacement or other substitute
  legs. Capture both the selected result and its expanded details.
- Record the query timestamp at visible submission, the screenshot timestamp as
  retrieval time, and the result-page URL only after the form itself created it.
  The URL is evidence, never a constructed request. The `screenshot` command
  writes a browser artifact; copy it into the dated raw release, hash it, add it
  to `manifest.csv`, then add the matching transcription row.

## Measurement definition

Before collecting the full set, record these definitions in the methodology and
schema. They prevent apparently precise but incomparable results.

| Item | Proposed definition |
| --- | --- |
| Origin | One reviewed primary National Rail station per candidate location, identified by CRS code and station name. |
| Birmingham destination | Birmingham New Street (CRS `BHM`). |
| London destination | A documented London rail gateway. Prefer the National Rail `London Terminals` group if RTJP supports it; otherwise agree and use one named terminal consistently. Never label this as a door-to-door central-London time. |
| Measurement date | Friday 11 September 2026 (`2026-09-11`). This is a dated snapshot, not a claim about an enduring timetable. |
| Selection window | Friday 11 September 2026, 10:00–14:00 local time (`2026-09-11T10:00:00+01:00` to `2026-09-11T14:00:00+01:00`). This avoids peak-commute distortions while allowing fast intercity patterns to appear. |
| Departure rule | Select the shortest elapsed suitable itinerary departing within the selection window. |
| Main mode | National Rail itinerary. Exclude itineraries needing an unreviewed substitute bus or other non-rail leg. Record any permitted transfer mode explicitly. |
| Changes | Number of changes between passenger service legs, derived from the selected itinerary rather than inferred from station names. |
| Frequency context | If practical, count distinct suitable departures returned for the selected date in a stated two-hour window alongside the fastest journey. Call this “usable departures in the window”, not a general train frequency. |

The public planner uses a preferred departure time rather than a four-hour range.
Start one session at 10:00 and inspect its “later journeys” results until 14:00.
If that session does not expose results through 14:00, make up to four searches
at 10:00, 11:00, 12:00 and 13:00. Select the shortest suitable itinerary among
all displayed results whose departure is in the window. Record every search time
actually used, plus the actual query timestamp. A current disruption can alter
the displayed result, which is part of what the dated planner snapshot records.

For later refreshes, use a future ordinary weekday and the same stated local
selection window. Do not call a result “the fastest journey of the day”; it is
the fastest suitable journey observed in the documented 10:00–14:00 window.

The London endpoint also needs explicit review. Use `London Terminals` only if
the public planner offers it as a destination; otherwise use a named terminal
consistently. Do not silently select the fastest among different terminals.

## Methodology record

Create `docs/national-transport-methodology.md` before acquiring canonical
values. It must document the following, in sufficient detail for another person
to repeat and assess the collection:

1. Scope: broad candidate locations; national station-to-station rail access;
   no property, neighbourhood or door-to-door claim.
2. Source: National Rail public Journey Planner, its URL and retrieval method;
   distinguish displayed planner observations from API data.
3. Endpoints: the reviewed origin station for every place, London destination
   definition, and Birmingham New Street.
4. Standard measurement rule: `2026-09-11`, the local selection window
   `10:00:00–14:00:00+01:00`, “shortest displayed suitable itinerary in that
   window”, starting with a 10:00 planner session and inspecting later results;
   use searches at 11:00, 12:00 and 13:00 only if needed to cover the window.
5. Exact fields collected, selection rule when the planner returns multiple
   options, definition of a change, and any excluded rail-replacement or
   non-rail legs.
6. Frequency method, including the two-hour window, query time(s), definition
   of a distinct departure, and when frequency is left blank.
7. Evidence capture: page capture/screenshot, result URL, query/retrieval time,
   transcription, source-period and limitations.
8. Interpretation: a timetable/planner snapshot that can change; no assurance
   of future service, fare, accessibility or door-to-door travel time.

The methodology must state that the local-transport assessment uses a different
topic CSV, rubric and evidence. National journey values must not be used to
infer a local-transport band.

## Data model

Add a reviewed station mapping input, for example
`data/inputs/transport_stations.csv`:

```text
location_id,station_crs,station_name,selection_reason,confidence,evidence_ids
```

Extend `nationalTransport.csv`, or introduce a normalised route-observation CSV
that the build script compiles into the existing fields. Preserve the existing
`londonMinutes`, `londonChanges`, `birminghamMinutes` and
`birminghamChanges` fields for UI and score compatibility. The source input
should additionally retain, per location and destination:

```text
location_id,destination_id,origin_crs,destination_crs,measurement_date,
selection_window_start_local,selection_window_end_local,planner_search_times,
query_timestamp_local,selected_departure_local,selected_arrival_local,
elapsed_minutes,changes,frequency_window_start_local,
frequency_window_end_local,usable_departures_in_window,source_url,
raw_capture_path,retrieval_timestamp,confidence,evidence_id,reason
```

Use blank values for unavailable routes or unreviewed mappings. A zero change
count or zero-minute Birmingham journey remains a real value, not a missing one.

## Evidence and reproducibility

For each acquisition run:

1. Retain a page capture or screenshot and a structured transcription for every
   route; retain the exact result URL where the site supplies one.
2. Create a release manifest recording source page, visible query values,
   measurement date, query/retrieval timestamp, artifact hash and limitations.
3. Write a standard-library-only transformation script that reads the retained
   review transcription and produces reviewable staging CSVs. Do not make this
   script automate or scrape the public planner.
4. Require an explicit review of station selection, unavailable results,
   anomalous durations and change counts before canonical input is updated.
5. Add one evidence-catalogue row describing the measurement date, provider,
   coverage and known limitations.

Results are intentionally refreshable. A new timetable, disruption handling or
provider routing change may legitimately produce a different value; retaining
the dated raw run makes that change auditable.

## Pilot before full acquisition

Do not start by modifying the screen or score. Run a 12-location pilot spanning
direct and interchange-heavy routes, London-adjacent places, Wales, the North
East, North West, Yorkshire and the West Midlands.

The pilot should:

1. Complete reviewed station mappings for the twelve locations and both
   destinations.
2. Browse the public National Rail planner using the agreed measurement
   definition, capturing the displayed evidence.
3. Inspect the selected itineraries and review a small sample independently.
4. Compare old imported figures with new results, explaining material
   differences as endpoint, date, wait-time or itinerary-definition changes;
   do not force them to match.
5. Test the transformation, build and unit-test suite from retained artifacts.
6. Confirm that browser collection remains practical before acquiring all
   candidate routes.

Only after that review should the script collect the complete two-destination
set. Include all candidate locations; no hard-coded row count is permitted.

## Provider fallbacks

If public planner collection proves impractical, evaluate these in order:

1. **Formal National Rail RTJP** — official point-to-point/multi-leg API for
   automated refreshes, subject to licence, cost and access approval.
2. **TransportAPI Journey Planner** — commercial fallback for a small batch.
   Its permanent free plan supplies station timetable and places endpoints, not
   the Journey Planner, so do not assume a free route-collection service.
   [TransportAPI developer portal](https://developer.transportapi.com/)
3. **Google Routes Transit** — useful validation or a future exact-coordinate
   door-to-door experiment: it can return walking and transit legs, transit
   details and timed routes. It is not the default canonical source because its
   terms, billing and mode preferences require a separate review.
   [Google transit route documentation](https://developers.google.com/maps/documentation/routes/transit-route)
4. **Network Rail CIF schedules plus local OpenTripPlanner** — reserve for a
   separately funded data-engineering project, not this acquisition. It is the
   path to fully self-hosted routing but is disproportionate to 83 origins and
   two destinations.

Traveline/BODS data, NaPTAN and regional authority feeds are useful supporting
references for local transport but do not replace a national rail journey
planner. TfL's journey planner is appropriate only for a future, separately
defined London last-mile calculation.

## Walking to the selected station

Do not include a generic walking allowance in the national score. The current
place centroids are broad place anchors, not addresses of potential homes.

There is one modest, potentially useful measure: `mapped place-centre to selected
station`. It can explain whether the selected gateway is central or peripheral,
but it is not a proxy for every flat's station access.

Do not collect a walking duration in the initial national-transport release
unless a consistent, reviewed anchor can be defined for every location. The
current coordinates are place centroids and may not be a recognisable or
walkable town-centre point. A walking route from an arbitrary centroid would be
false precision.

If a later review establishes reliable anchors, add a separate measure named
exactly “walk from mapped place anchor to selected rail station”. Store the
anchor rationale and coordinates, station coordinates, walking-router source and
profile, retrieval date, route distance and walking minutes. Display it as
context only; it must not be added to national rail duration or the score unless
a future scope decision explicitly adopts a true door-to-door definition.

## UI and scoring rollout

Initially retain the existing score formula and add contextual fields to the
Rail connections panel:

```text
To London rail gateway: 88 min · 0 changes
11 Sep 2026 · fastest observed 10:00–14:00 · departure 10:03 · arrival 11:31
```

Display source date, query time and station names in the evidence detail. Explain
that durations are timed station-to-station itinerary snapshots, not a guarantee
and not travel from every home in the settlement.

Do not add frequency as a new weighted factor until the full run has been
reviewed. It is valuable context but needs a separately agreed scoring rule.

## Stretch: map presentation

First implement a map toggle for `London rail gateway` / `Birmingham New Street`
that colours or rings the existing candidate markers by the already documented
effective-time bands. This uses the acquired table data, does not need polygon
geometry and is legible alongside the current map.

Defer public-transport isochrone polygons. A commercial option, TravelTime, can
return public-transport matrices and GeoJSON isochrones, but introduces a paid
dependency and is not needed to obtain the route measures. Existing published
GB London/Birmingham public-transport isochrones are useful historical visual
references only: they date from 2021 and their author cautions against relying
on them for current planning.

- [TravelTime API documentation](https://docs.traveltime.com/api/overview/introduction)
- [Published GB public-transport isochrones](https://tomforth.co.uk/gbisochrones/)

If polygons are later approved, specify a fixed departure/arrival window,
mode, maximum walking allowance, timetable date and rendering simplification.
Retain GeoJSON as a dated derived artifact, clearly labelled as a timetable
snapshot rather than a permanent accessibility boundary.

## Completion criteria

The first complete transport release is ready only when:

- every candidate has either two reviewed route observations or an explicit
  missing/review reason;
- every origin station choice is documented and evidence-linked;
- raw requests and responses, manifest and transformation script are retained;
- canonical inputs, generated outputs, methodology and UI wording agree;
- `python3 scripts/build.py` and `python3 -m unittest discover -s tests` pass;
- the change is reviewed, accepted, committed and pushed.
