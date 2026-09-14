# Market-stock acquisition methodology

The market-stock field is a dated Rightmove headline count for an exact one-bedroom
flat search. It is a portal snapshot, not a deduplicated inventory, supply estimate,
or count of suitable homes. Rightmove's proprietary regions may differ from the
broad location, built-up area and local-authority geographies used elsewhere.

## Direct HTTP acquisition

Browser automation is not required. Both inputs are ordinary public HTTP GET
responses: the location typeahead endpoint returns JSON and each filtered search
returns HTML containing one machine-readable `resultCount`. The acquisition script
uses Python's standard library, a descriptive user agent and a short delay between
search requests. It opens no listing pages and refuses to overwrite a release.

First review one exact `REGION` result per broad location in a mapping CSV. Retain
the resolver's label exactly, including anomalous county wording, and lower the
mapping confidence when the proprietary label conflicts with canonical geography.
Then run:

```sh
python3 scripts/acquire_market_stock.py \
  data/raw/releases/YYYY-MM-DD-market-stock \
  --mappings data/registry/market_stock_mappings.csv
```

The release retains the resolver JSON, sale and rent HTML, retrieval timestamps,
request URLs, byte sizes and SHA-256 hashes. The script verifies the reviewed
resolver ID, type and label and requires exactly one headline count in each search
page. A displayed zero is retained as an observed zero; a failed request, changed
response shape or ambiguous count fails the release instead of becoming zero.

Transformation remains offline and separate from acquisition:

```sh
python3 scripts/prepare_market_stock_release.py \
  --release data/raw/releases/YYYY-MM-DD-market-stock \
  --mappings data/registry/market_stock_mappings.csv \
  --output data/derived/market_stock_review.csv
```

The preparer re-verifies every manifest hash, reviewed resolver and unique count
before writing the review table. Canonical input changes are made only after that
table has been reviewed.

## Fixed filters and limitations

Both searches fix `minBedrooms=1`, `maxBedrooms=1` and `propertyTypes=flat`.
Sale excludes sold-subject-to-contract, retirement and shared-ownership results.
Rent includes let-agreed results and excludes house shares and retirement results.
Because those filters differ by tenure, sale and rent counts must not be combined.

The captured HTML may contain property summaries as part of the results page, but
the pipeline reads only the single headline count. Counts can include duplicates,
stale advertisements and boundary mismatches, and can change immediately after
capture. Reuse of captured responses remains subject to Rightmove's website terms.
