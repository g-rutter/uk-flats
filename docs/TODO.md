# Next work

## Outstanding work

- Create reproducible fresh acquisitions for prices, rents and Rightmove counts
  for the original 63-location baseline, retaining dated raw snapshots,
  query/geography details and transformation scripts. Those non-crime values
  remain imported historical claims.
- For the 19-place expansion cohort, acquire retained Rightmove one-bedroom
  sale/rent result snapshots and resolver mappings. Populate `market.csv` and
  the tenure-specific `oneBedCount` fields only from those dated observations.
- For the 19-place expansion cohort, acquire and review national-rail and local
  transport evidence, then add `nationalTransport.csv` and
  `localTransport.csv` rows. The missing inputs intentionally leave composite
  scores blank.
- For the 19-place expansion cohort, review quiet and condition using the
  documented broad-assessment method and add evidence-linked `quiet.csv` and
  `condition.csv` rows. Do not infer assessment bands from nearby locations.
- Keep Police.uk ASB research-only unless a dated archive passes the documented
  force/month coverage and geography review. The ONS CSP recorded-offence
  replacement is complete and is already displayed.

## Location expansion

Completed on 7 September 2026 at the user's request: 19 locations were added to
the canonical inputs, generated broad screen and UI. Each has a location
identity/centroid, HMLR all-flat sale proxy, July 2026 ONS one-bedroom LA rent
proxy, and separate ONS CSP violence-against-the-person and sexual-offence rates.
The raw HMLR, ONS rent and ONS crime artifacts and their source metadata are
retained in the repository's existing dated releases/snapshots.

The expansion entries are intentionally incomplete: no market stock, transport,
quiet or condition observation has been asserted, and therefore neither buying
nor renting composite score is calculated for them. Missing values are displayed
as unavailable, never as zero.

| Gap addressed | Status | Locations |
| --- | --- | --- |
| Major southern and south-west markets | Added | Bristol; Southampton; Bournemouth–Poole; Brighton & Hove; Exeter |
| South East and London-adjacent markets | Added | Reading; Milton Keynes; Luton; Southend-on-Sea |
| East of England | Added | Cambridge; Colchester |
| High-cost comparator cities | Added | Oxford; Bath |
| Underrepresented Welsh centres | Added | Bridgend; Llanelli; Bangor; Rhyl |
| Useful regional comparators | Added except Cheltenham | York; Durham; Cheltenham remains a possible future addition |

London is a material coverage gap, but requires a separately agreed geography
before inclusion: a single London row is too coarse, while borough-scale rows
would change the current population-centre approach.
