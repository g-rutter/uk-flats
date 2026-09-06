# Location registry

This is the editable intake register for proposed and accepted expansion places;
it is deliberately separate from `data/inputs/locations.csv`.  The current 63
rows are an imported baseline and are not silently backfilled here.

Use `proposed` while a geography is being researched.  Change to `accepted`
only after every mapping column has been reviewed against a retained lookup
artifact in `data/raw/releases/<release>/`.  `scripts/prepare_locations.py`
then validates the row and writes reviewable candidate `locations.csv` and
`crime_geographies.csv` files to staging (or explicit output paths).

Blank mappings are allowed only for `proposed` rows and must have a
`missing_data_reason`.  No script infers a town, LA, CSP, price-query or portal
mapping from a nearby location or display name.

`validation_probe.csv` predeclares a 12-place method-validation sample. Its
rent and buy result columns record the completed dated probe; the remaining
topic columns stay blank until their own reviewed probes are prepared. It is a
comparison sheet, not new evidence or an expansion cohort.
