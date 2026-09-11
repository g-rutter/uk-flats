# Digital connectivity methodology

Digital connectivity is shown as a contextual, plottable field. It does not
enter either the Buying or Renting composite score.

## Measure and source release

The measure is the percentage of residential premises with gigabit-capable
fixed-broadband availability in Ofcom's Connected Nations Spring 2025 release.
The release is a January 2025 snapshot and publishes coverage for the whole UK
at postcode and Census Output Area (OA) level. This implementation uses the
residential OA file because it aligns with the project's reviewed OA-to-Built-up
Area (BUA) geography.

Gigabit availability is selected as the single plotted field. It describes
whether a provider reported that a gigabit-capable fixed-broadband service was
available at a premise. It is more consistent for broad comparison than an
observed-speed measure, which also reflects package choice, take-up, equipment,
Wi-Fi, congestion and user behaviour. Availability is still not a guarantee of
service, speed, price, latency, reliability or quality at a particular home.

Ofcom collected the wider fixed-coverage data from nearly 70 fixed-network and
fixed-wireless-access providers and constructed the premise base from Ordnance
Survey AddressBase Epoch 115. The selected gigabit field is reported for fixed
broadband. Unmatched premises are included in the denominator and remain
unclassified; the candidate table therefore retains matched-premise counts as
evidence context.

## Settlement aggregation

The same reviewed April 2024 BUA mappings used by local public transport and the
residential environment are reused without a new geography decision. Most
screen locations map to one BUA; Bournemouth–Poole and Torbay retain their
explicit multi-BUA definitions.

The BUA percentage is reconstructed from Ofcom's published residential-premise
counts, rather than averaging already-rounded OA percentages:

```text
sum(OA residential premises with gigabit availability)
------------------------------------------------------- × 100
             sum(OA residential premises)
```

OAs absent from Ofcom's residential-premises file do not contribute to either
count. The canonical table retains the number of OA rows present and the total
number of OAs in the BUA lookup, so this distinction is visible rather than
silently treating absent rows as measured zeros. Every current location has at
least one source OA row and a positive residential-premise denominator.

The generated percentage retains four decimal places so the numerator and
denominator reproduce exactly within rounding tolerance. The browser displays
one decimal place and uses the full candidate-set range for its map gradient.
No percentile, score or composite weight is derived.

## Reproduction and release controls

The dated source release is `data/raw/connectivity/2026-09-11/`. Its manifest
records the official OA ZIP and data dictionary PDF with URLs, byte sizes,
periods, limitations and SHA-256 hashes. The OA-to-BUA lookup is the separately
retained and hash-verified ONS artifact in the local-transport release.

Acquire a fresh, new snapshot directory with:

```sh
python3 scripts/acquire_digital_connectivity.py data/raw/connectivity/YYYY-MM-DD
```

Reproduce the current canonical and review tables offline with:

```sh
python3 scripts/prepare_digital_connectivity.py \
  --canonical-output data/inputs/digital_connectivity.csv
python3 scripts/build.py
python3 -m unittest discover -s tests
```

The preparer verifies both release manifests, archive members, source columns,
OA uniqueness, count bounds, source percentage arithmetic, reviewed mappings
and positive denominators. A refresh must update the explicit release constants
and rerun all locations together; individual locations are not hand-edited.
