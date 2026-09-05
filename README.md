# UK flat location comparison

A reproducible broad comparison of places where you might buy or rent a one-bedroom
flat. Starts with the previous attempt's 63 England and Wales locations. No
shortlist, neighbourhood drill-down, individual listings or final grades.

Open **web/index.html** directly in a browser to compare locations. No server,
network connection or package installation is required. The original map explorer
is retained in `data/archive/UK flats (attempt 2)/` for future reuse; its rankings are obsolete.
The new view is a simple searchable table with buy/rent modes and evidence details.

## Rebuild

Requires Python 3.9+ (standard library only):

```sh
python3 scripts/build.py
python3 -m unittest discover -s tests
```

Edit CSVs in `data/inputs/`, then rebuild. Generated outputs are
`data/derived/broad_screen.csv` (one row per place) and `web/data.js`.
UI changes belong in `web/index.html`, `web/styles.css` and `web/app.js`.
Commit changes to inputs, scripts and generated files together.

To repeat the historical extraction without changing current inputs:

```sh
python3 scripts/extract_legacy.py
```

`--initialize` is only for a fresh checkout with no input CSVs; it refuses to
overwrite existing inputs. Normal updates never require re-extracting the archive.

## Adding locations and updating evidence

1. Add a unique, stable `id` and identity fields to `data/inputs/locations.csv`.
2. Add any known observations to the corresponding topic CSV, using `location_id`.
   Missing topic rows and blank numeric cells are allowed; they remain unknown.
3. Record source links in `sources.csv` and source period, retrieval date, geography,
   coverage and limitations in `evidence.csv`. For a new source/period affecting only
   some places, explicitly name those location IDs in coverage; do not silently
   apply the original shared period to new observations.
4. Rebuild and review the CSV and browser view. Never copy a nearby place's figures
   to fill gaps. A source update requires its own documented acquisition script
   and raw snapshot; the supplied handover cannot regenerate upstream statistics.

## Current status

Data are **imported legacy claims, not independently verified fresh research**.
Buying is an all-flat achieved-price proxy; renting is a modelled one-bedroom
local-authority mean. Crime is excluded from the current comparison pending a
population-normalised replacement. Combined rankings are deliberately absent.

See [orientation](AGENTS.md), [methodology](docs/methodology.md),
[provenance and schema](docs/provenance.md), and [to-do list](docs/TODO.md).
