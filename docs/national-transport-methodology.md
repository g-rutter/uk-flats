# National transport acquisition methodology

## Scope and interpretation

This workstream compares national rail access from one reviewed National Rail
station for each broad candidate location to two fixed destinations. It covers
the project's broad places only; it is not a property, neighbourhood, walking,
accessibility, fare, or door-to-door measure. A result is a dated Journey
Planner observation and can change with timetables, disruption and provider
routing.

It is separate from `localTransport.csv`. Local transport's qualitative broad
bus-and-rail assessment uses its own rubric and evidence; a national journey
duration must never be used to infer or change that band.

## Source and endpoints

The canonical source is the public [National Rail Journey
Planner](https://www.nationalrail.co.uk/journey-planner/), manually used in a
browser. The planner accepts a station name or three-letter code and presents
several options for a requested date and time; its public guide says that each
option shows departure/arrival times, journey time, direct/changes information
and any bus, ferry or rail-replacement part. This collection records displayed
observations only. It does not automate, scrape, or rely on undocumented
browser requests. NaPTAN/NPTG may support station-reference review but is not
the journey-time source.

Each origin is recorded in `data/inputs/transport_stations.csv`, with its CRS,
station name, selection rationale, confidence and evidence IDs. No mapping is
treated as reviewed until that row and its linked evidence are present.

The Birmingham endpoint is Birmingham New Street (`BHM`). The London endpoint
is the Journey Planner's `London Terminals` group, provided the planner offers
that exact destination during the pilot. The group is not a three-letter CRS;
its exact displayed identifier is retained in `destination_crs`. If the pilot
cannot select it, the pilot stops for an explicit endpoint decision before any
canonical values are acquired. Results must be labelled “London rail gateway”,
not central-London or door-to-door time.

## Standard snapshot rule

The planned journey date is Friday 11 September 2026. The selection window is
10:00:00--14:00:00 local time (`+01:00`). Queries and retrievals are made on
the collection date and record their actual timestamps. Start with a 10:00
departure search and inspect later journeys. If the displayed session cannot
cover the whole window, additionally search at 11:00, 12:00 and 13:00 only as
needed.

For each origin/destination pair, select the shortest elapsed suitable
itinerary displayed whose departure falls in that window. A suitable itinerary
is a National Rail itinerary without an unreviewed bus, ferry, rail-replacement
or other non-rail substitute leg. Transfers explicitly displayed as rail legs
are allowed. `changes` is the number of changes between passenger-service legs
shown by the selected itinerary; it is never inferred from station names. An
unavailable result or an excluded-only result has blank duration/change fields
and an explicit reason.

Where practical, count distinct suitable departures in a separately recorded
two-hour local window. Call it `usable_departures_in_window`; it is context for
that displayed date/window, not a general service frequency. Leave it blank if
the result view cannot support a reliable count.

## Capture, transcription and review

For every route observation, retain a result-page capture (or screenshot), the
result URL when supplied, and one row in
`transport_route_observations.csv`. A dated raw release contains the captures
and a standard release `manifest.csv`, including the visible query, timestamps,
hashes and limitations. `raw_capture_path` is relative to that release.

Run `python3 scripts/prepare_national_transport.py` against the release and
transcription. It verifies retained capture hashes through the manifest, checks
the station mapping and route fields, and writes reviewable long and pivoted
staging CSVs. It never requests the planner and does not update canonical
`nationalTransport.csv`. Review station choices, unavailable routes, anomalous
durations and change counts before copying a reviewed full release into
canonical inputs.

The UI may show a duration, changes, journey date, observed departure and
arrival, origin/destination station names, and query time. It must explain that
these are station-to-station planner snapshots, not a guarantee or a journey
from every home. Frequency remains unweighted unless a later scoring decision
explicitly changes that rule.
