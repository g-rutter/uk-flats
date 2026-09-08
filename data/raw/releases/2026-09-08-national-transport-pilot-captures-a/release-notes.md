# National transport pilot UI captures A

UI-only result captures collected through the visible National Rail Journey
Planner for the reviewed pilot station mappings, using 11 Sep 2026 and the
10:00, 11:00, 12:00 and 13:00 departure searches. These are review artifacts
only; no journey values were transcribed and no canonical inputs were changed.

Completed full four-time result captures with `capture-metadata.json`:

- `transport/birmingham__london/`
- `transport/leeds__birmingham/`
- `transport/leeds__london/`
- `transport/wolverhampton__birmingham/`
- `transport/wolverhampton__london/`

Partial route:

- `transport/manchester__london/` has result snapshots and PNGs for 10:00,
  11:00 and 12:00, plus the 13:00 result snapshot; the 13:00 screenshot was
  interrupted before it could be retained.

Unavailable in this stopped slice:

- `transport/manchester__birmingham/` has only an initial form-open snapshot;
  the visible hour control timed out before a result capture was produced.
- Birmingham (BHM) to Birmingham New Street (BHM) is a degenerate same-station
  route and is documented as unavailable by the collection plan; no planner
  query is required or recorded.

The collector deliberately retained visible form snapshots, result
accessibility snapshots, screenshots where completed, and capture metadata. A
reviewer must inspect captures, select suitable itineraries, retain expanded
details, and transcribe only displayed values in a later approved step.
