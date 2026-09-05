# UK flat location comparison

A reproducible broad comparison of places to buy or rent a one-bedroom flat. It
covers the previous attempt's 63 England and Wales locations. No shortlist,
neighbourhood, listing or final-grade analysis is included.

Open **web/index.html** directly in a browser. No server, network or package
installation is required. The original map explorer is retained in
`data/archive/UK flats (attempt 2)/`; its rankings are obsolete. The current view
is a searchable table with buy/rent modes and evidence details.

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

Repeat the historical extraction without changing current inputs:

```sh
python3 scripts/extract_legacy.py
```

`--initialize` is for fresh checkouts with no input CSVs; it refuses to overwrite
existing inputs. Normal updates do not require archive extraction.

## Adding locations and updating evidence

1. Add a unique, stable `id` and identity fields to `data/inputs/locations.csv`.
2. Add any known observations to the corresponding topic CSV, using `location_id`.
   Missing topic rows and blank numeric cells remain unknown.
3. Record source links in `sources.csv` and source period, retrieval date, geography,
   coverage and limitations in `evidence.csv`. For a source/period covering only
   some places, list those location IDs; do not apply the shared period silently.
4. Rebuild and review the CSV and browser view. Never copy nearby figures to fill
   gaps. Source updates require a documented acquisition script and raw snapshot;
   the handover cannot regenerate upstream statistics.

## Current status

Data are **imported legacy claims, not independently verified research**. Buying is
an all-flat achieved-price proxy; renting is a modelled one-bedroom local-authority
mean. Fresh ONS crime research has a separate pipeline; see [crime research](docs/crime-replacement.md).
Its rates remain excluded pending ASB, boundary and coverage review. Combined
rankings are absent.

See [orientation](AGENTS.md), [methodology](docs/methodology.md),
[provenance and schema](docs/provenance.md), and [to-do list](docs/TODO.md).
