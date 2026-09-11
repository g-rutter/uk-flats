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

Marker colour can show the composite score, the recorded-offence and
national-transport component scores, or the observed price, rent, transport,
environment or listing value that directly underpins a component. It can also
show the contextual Ofcom gigabit-availability percentage, which is not a
composite input. It uses a
continuous gradient over the full candidate-set range for the selected tenure and
measure: the lowest and highest observed values receive the first and last
palette colours, and filters do not change the scale. The fixed Forest gradient
changes presentation only. Each visible location with a known value is marked on
the bar, and the selected location is called out with its exact displayed value.
The key shows the active measure and its range in the measure's own units. For
price and rent, the palette stays in its normal visual direction while the key's
endpoints are swapped: lower housing costs receive the better-end colour and
higher costs the worse-end colour.
Unknown values are neutral; do not copy archived scores or ranking logic. The two
underlying ONS offence rates remain visible alongside the limited recorded-offence
safety proxy, and ASB remains excluded.
