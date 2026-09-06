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

Location and country controls filter both the map and the list. Each table-column
heading changes only the table order; it never changes marker colours, scores or
map inclusion.

Marker colour shows each tenure's generated highest, middle and lowest score
thirds, using the shared pine, amber and clay palette. Tied scores remain in the
same group, so the groups are as evenly populated as ties allow. The grouping is
calculated by the build from current canonical inputs, which also emits the
inclusive score bounds displayed in the map key; do not copy archived scores or
ranking logic. The two underlying ONS offence rates remain visible alongside
the limited recorded-offence safety proxy, and ASB remains excluded.
