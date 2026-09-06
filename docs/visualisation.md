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
- `web/styles.css` owns responsive presentation only.

Marker colour currently distinguishes England and Wales only. A future score or
metric layer must follow the documented methodology and use current generated
data; do not copy archived scoring or ranking logic. Crime measures remain
separate evidence until their treatment is decided in that methodology.
