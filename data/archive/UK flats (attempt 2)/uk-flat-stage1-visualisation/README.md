# Stage 1 broad-screen visualisation

Open `index.html` directly in a modern browser. No local server, package install, framework, CDN, or internet connection is required.

## File layout

- `index.html` — semantic page structure and the embedded Great Britain SVG outline.
- `locations.js` — all research data and global Stage 1 metadata. This is the main file to replace or edit when the dataset changes.
- `app.js` — filtering, tenure switching, map markers, detail panel, table rendering, and formatting.
- `styles.css` — all visual styling and responsive layout.

## Data contract

`locations.js` defines `window.STAGE1_DATA` with:

- `meta`: research stage, weights, retrieval date, proxy definitions, and global cautions;
- `locations`: one record per screened location, including coordinates, buy/rent screening data, factor scores, reasons, journey times, tower signal, and source links;
- `evidence`: the workbook's evidence-log metadata retained for later extension.

The interface deliberately does **not** show final A–E grades or candidate subareas, because those are not supported by the Stage 1 broad-screen evidence.

## Iteration notes

Common changes should be isolated:

- change data only: edit/replace `locations.js`;
- change layout/visual design only: edit `styles.css` and `index.html`;
- change filtering, score display, or interaction: edit `app.js`.

The map projection is a simple local equirectangular projection defined in `app.js`; it matches the embedded SVG outline in `index.html`.
