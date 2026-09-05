# Next work

## Priority: replace crime data (in progress)

Implemented first acquisition/calculation pass; see [crime research](crime-replacement.md).

- [x] Investigate official LA-scale evidence and select CSP geography, retaining
  codes, combined/split-LA exceptions and unknown boundary vintage explicitly.
- [x] Preserve fresh ONS March 2026 workbooks, source hashes and acquisition script.
- [x] Extract violence and sexual-offence counts with matched mid-2024 population
  for all 63 places; calculate separate research rates for April 2025–March 2026.
- [x] Reconcile calculations to published rates, quantify force unallocated totals,
  inspect extremes, and distinguish ONS coverage from the Police.uk Manchester gap.
- [ ] Acquire compatible local ASB counts. ONS appendix tables contain national
  totals only, so local values remain unknown. Request network approval before
  downloading the relevant Police.uk archive (~1.6 GB), or obtain an approved
  custom download. Do not retry the 403 request silently, download without
  approval, or treat changelog/availability snapshots as counts. Use
  `scripts/acquire_police_archive.py`, retain its archive, URL, retrieval time
  and SHA-256 manifest, then run `scripts/asb.py` on the ZIP.
- [x] Snapshot Police.uk coverage evidence and generate a 12-month force audit
  for the ASB fallback, retaining known issues and later refresh notices. This
  audits published notices, not actual submission completeness.
- [ ] Compare ASB submissions with the coverage audit and a verified LSOA-to-CSP
  lookup before aggregating. `scripts/asb.py` is an offline ZIP inspector; it
  treats no submission as complete and generates no local counts. First obtain
  an authoritative 2021 LSOA-to-CSP lookup, including split Northamptonshire
  CSPs, and confirm its vintage and fields. Reconcile each archive force/month
  with `data/derived/crime_coverage.csv`, including refresh notices, missing
  files, empty ASB rows, missing LSOAs and the permanent BTP gap. Preserve
  unknowns; do not annualise, impute, deduplicate by Crime ID or aggregate
  before reviewing membership and month completeness.
- [x] Snapshot the official April 2025 LA-to-CSP relationship lookup and audit
  every canonical mapping, retaining mismatches and split-LA ambiguity.
- [ ] Reconcile Barnsley/Sheffield's 2025 LA changes with the ONS workbook and
  population basis. Obtain LSOA membership for split Northamptonshire CSPs;
  current-LA joins cannot resolve them. Compare authoritative 2021 LSOA/CSP or
  polygon evidence with the April 2025 lookup and workbook codes. Document any
  incompatible population footprint before changing `crime_geographies.csv`.
- [ ] Verify boundary vintage and monthly completeness; resolve material residuals
  (especially Humberside and Gloucestershire) and review outliers.
  `crime_residual_audit.csv` flags residuals at 5%; `crime_outlier_audit.csv`
  lists the three lowest and highest available rates per category. Neither audit
  allocates residuals or creates a safety score. Use authoritative evidence; do
  not infer completeness from annual totals, changelog silence or matching codes.
  Retain unexplained residuals as review findings.
- [ ] Review comparability before displaying crime measures. Research CSV is
  available, but browser safety remains pending and combined rankings absent.

Latest pass: `data/derived/crime_boundary_audit.csv` identifies 59 code-agreeing
locations, two LA-code mismatches and two split-LA cases. These are relationship
checks, not verified footprints. Police.uk custom ASB download returned HTTP 403;
actual submissions and refresh reconciliation remain outstanding. See the crime
research document for the precise request and source findings.

## Reproducibility and evidence quality

- Recover or recreate acquisition scripts and raw snapshots for prices, rents and
  counts; first check whether missing checkpoints can be recovered.
- Audit workbook, JS values and source claims before treating them as verified.
- Add geography codes and per-observation evidence IDs for mixed-period updates;
  keep HMLR town, LA, portal region and centroid geographies distinct.
- Review coarse transport/quiet/condition judgements; preserve uncertainty and do
  not equate deprivation with appearance or upkeep.

## Interactive map

- Add an interactive map to the current explorer, using
  `data/archive/UK flats (attempt 2)/uk-flat-stage1-visualisation/` as reference:
  selectable markers, focus details, buy/rent switching, filters and linked
  evidence. Use generated data and retain broad-only scope, pending safety and
  absent combined rankings.
- Check the map in a browser, including keyboard interaction and mobile layout.
  The current table view has been statically checked, not manually browser-tested.

No shortlist, property sampling or neighbourhood drill-down is planned.

## Expand location list

Check with the user whether to add more England or Wales locations. If so, collect
their data through the same pipeline.
