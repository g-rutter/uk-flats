# Next work

## Priority: replace crime data

Use Police.uk ASB records for PFA/CSP aggregation, with a reusable archive-and-
lookup pipeline. Keep all 63 locations in scope; do not create safety scores or
shortlists.

- [x] Acquire and calculate ONS CSP violence and sexual-offence rates for April
  2025–March 2026, retaining populations, source cells, hashes and audits.
- [x] Acquire dated ONS LA-to-CSP and Police.uk coverage snapshots.
- [x] Acquire the official Police.uk March 2026 archive for ASB research.
- [x] Add `scripts/aggregate_asb.py` with period, archive and lookup parameters.
- [x] Run and review ASB PFA/CSP aggregation. Keep split-LA and incomplete
  force/month results unknown; never annualise, impute or deduplicate ASB by Crime ID.
- [x] Reconcile Barnsley/Sheffield boundary changes and Northamptonshire splits.
- [x] Review material ONS residuals and crime outliers.
- [x] Decide whether reviewed crime measures are comparable enough to display.

## Checkpoint

Current checkpoint: the separate ONS CSP violence and sexual-offence rates are
displayed for all 63 locations after the documented residual/outlier review.
Barnsley and Sheffield LA code changes are reconciled; Kettering and Northampton
use directly named CSP rows and matching CSP populations rather than whole-LA
values. ASB acquisition artifacts and the reusable aggregator are retained, but
ASB is not comparable enough to display: Manchester has no force files in the
archive and force/month completeness is unresolved. No ASB values are in canonical
inputs.

```sh
python3 scripts/prepare_crime.py
python3 scripts/build.py
python3 -m unittest discover -s tests
```

Continue ASB research with a new dated archive and period:

```sh
python3 scripts/acquire_police_archive.py YYYY-MM data/raw/crime/new-snapshot
python3 scripts/aggregate_asb.py ARCHIVE LSOA_LAD_CSV CSP_LOOKUP_JSON OUTPUT.csv \
  --start YYYY-MM --end YYYY-MM [--lad-code-map OLD=NEW]
```

Retain each source URL, retrieval time and SHA-256. Review generated output before
changing `data/inputs/`; never hand-edit generated files.

## Other work

- Recreate missing source checkpoints for prices, rents and portal counts.
- Review transport, quiet and condition assessments.
- Add the interactive map only after crime review.
- Ask before expanding the 63-location list. No shortlist or property sampling.
