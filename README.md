# UK flat location comparison

A reproducible broad comparison of 83 England and Wales locations for buying or
renting a one-bedroom flat. It does not cover neighbourhoods, individual
buildings or listings.

Open **web/index.html** directly in a browser. No server, network or package
installation is required. The current view is a searchable, map-based explorer
with buy/rent modes and evidence details. Archived material is not active input
unless explicitly requested. See [visualisation notes](docs/visualisation.md).

## Rebuild

Requires Python 3.9+:

```sh
python3 scripts/build.py
python3 -m unittest discover -s tests
```

Edit CSVs in `data/inputs/`, then rebuild. Generated outputs are
`data/derived/broad_screen.csv` (one row per place) and `web/data.js`.
UI changes belong in `web/index.html`, `web/styles.css` and `web/app.js`.
Commit changes to inputs, scripts and generated files together.

The residential-environment source preparation and research QA use a separate
pinned tabular/GIS environment:

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements-environment.txt
.venv/bin/python scripts/prepare_residential_environment.py
.venv/bin/python scripts/review_residential_environment.py
```

These commands verify the retained raw manifests and regenerate the 83-row
candidate input, versioned release row, national audit covering 7,070 Office for
National Statistics (ONS) Built-up Areas (BUAs), and the 83-row England–Wales
compatibility stress test plus sensitivity, outlier, correlation, country-domain
and boundary diagnostics. The standard build validates and consumes the resulting
canonical input without requiring GIS libraries.

Repeat the historical extraction without changing current inputs:

```sh
python3 scripts/extract_legacy.py
```

`--initialize` is for fresh checkouts with no input CSVs; it refuses to overwrite
existing inputs. Normal updates do not require archive extraction.

## Rehydrate large raw artifacts

Some retained raw downloads exceed GitHub's per-file limit, so a clone contains
their manifests, URLs and SHA-256 checksums but not the binary files. Restore
and verify only the missing artifacts with:

```sh
python3 scripts/rehydrate_raw.py data/raw/releases/2026-09-06-baseline-probe
python3 scripts/rehydrate_raw.py data/raw/crime/police-2026-09-05
```

The command never updates a manifest. It fails if either a download or an
existing local artifact differs from its committed checksum.

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

Every location uses the same canonical fields and composite method. Observation
provenance is assessed per location and topic in the generated release audit:
some non-crime observations still need retained row-level artifacts, while
others are reproducible from dated releases. This limitation is evidence context,
not a separate kind of location. Local public-transport connectivity is complete
for all 83 locations. Residential environment replaces the former editorial
condition factor and has full population coverage for all 83 candidates and 7,070
national-reference BUAs. Its quiet and Energy Performance Certificate (EPC)
pillars use explicit within-country percentile calibration to make the mixed
published measures approximately comparable; raw values and limitations remain
visible in the browser.
Buying is an all-flat achieved-price proxy; renting is a modelled one-bedroom
local-authority mean. The screen calculates separate Buy/Rent broad composite
scores; their safety component uses the separate ONS CSP recorded-offence rates.
ASB remains excluded pending coverage review. See [crime research](docs/crime-replacement.md).

See [orientation](AGENTS.md), [methodology](docs/methodology.md),
[provenance and schema](docs/provenance.md), and [to-do list](docs/TODO.md).
The national-rail comparison is an accepted dated station-to-station snapshot;
its method and collection procedure are in the
[national transport methodology](docs/national-transport-methodology.md) and
[runbook](docs/national-transport-runbook.md).
The local public-transport factor is the DfT 2025 connectivity metric aggregated
to reviewed built-up areas; its reproducible method is in the
[local transport methodology](docs/local-transport-methodology.md).
The residential-environment release, national audit and selected
compatibility transform are described in the
[residential-environment methodology](docs/residential-environment-methodology.md)
and [implementation plan](docs/residential-environment-plan.md).
