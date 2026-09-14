# Map visualisation

`web/index.html` is an offline, map-based broad-screen view. It reads only the
generated `web/data.js`; do not add research observations, location coordinates,
or source links to the HTML, CSS or JavaScript.

## Updating data

Coordinates are canonical fields in `data/inputs/locations.csv`. Add or amend a
location and its topic CSV rows using the normal workflow, then run:

```sh
python3 scripts/build.py
python3 -m unittest discover -s tests
```

The build emits `web/data.js`, and the map creates one marker per currently
visible location. There is no fixed marker or location count in the application.
Blank coordinates remain unknown input data; the browser deliberately omits a
marker rather than inventing a position.

## Maintaining the interface

- `web/index.html` contains the static, public-domain Great Britain outline
  retained from the archived explorer.
- `web/app.js` owns projection, filters, keyboard/click marker behaviour, detail
  rendering and the table. Its simple local projection is aligned to that outline.
- `web/styles.css` owns the shared responsive presentation; `web/help.css`
  styles the click-to-open explanations in the detail panel.

The candidate set always retains the full current screen. Visitors can add any
number of numeric criteria, give each an inclusive minimum, maximum or both, and
combine them to refine the map and list. A location must meet every filled limit;
an unavailable value excludes it only when that measure is constrained. Clearing
the filters restores every candidate. Each table-column heading changes only the
table order; it never changes marker colours, scores or map inclusion.
The name search above the table narrows table rows only, within any active
criteria; it does not remove locations from the map.

The filter and map-colour selectors expose the same measures, grouped into score
components followed by the underlying and contextual feeds. This includes the
composite and all six component scores; housing, stock, local and national
transport, residential-environment and recorded-offence observations; Census 2021
built-up-area population; and the contextual Ofcom gigabit-availability percentage. The map uses a
continuous gradient over the full candidate-set range for the selected tenure and
measure, and filters do not change the scale. Lower-is-better measures reverse the
numeric endpoints so cost, pollution, noise, journey time, changes and
recorded-offence rates retain the better-end colour for lower values. The fixed
Forest gradient changes presentation only. Each visible location with a known
value is marked on the bar, and the selected location is called out with its exact
displayed value. The key shows the active measure and its range in the measure's
own units.
Unknown values are neutral; do not copy archived scores or ranking logic. The two
underlying ONS offence rates remain visible alongside the limited recorded-offence
safety proxy, and ASB remains excluded.
The smooth density sparkline above the colour bar summarises the visible known
values on that same fixed scale, so filtering changes the distribution but does
not move the scale endpoints. It uses the low smoothing level selected during
interface review to preserve local peaks in the distribution.
