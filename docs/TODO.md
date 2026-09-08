# Next work

## Outstanding work

- Create reproducible fresh acquisitions for prices, rents and Rightmove counts
  for the original 63-location baseline, retaining dated raw snapshots,
  query/geography details and transformation scripts. Those non-crime values
  remain imported historical claims.
- For the 20-place expansion cohort, obtain an NRE Online Journey Planner feed
  licence and credentials, or approve a controlled manual-capture protocol, then
  acquire fixed-date national-rail evidence and add `nationalTransport.csv` rows.
  The RTJP feed is licensed and credentials are required; do not substitute
  unrecorded journey estimates.
- For the 20-place expansion cohort, approve a fixed, evidence-linked reviewer
  rubric for local transport, quiet and condition, then add reviewed
  `localTransport.csv`, `quiet.csv` and `condition.csv` rows. Do not infer bands
  from nearby locations or convert deprivation into an appearance judgement.
- Keep Police.uk ASB research-only unless a dated archive passes the documented
  force/month coverage and geography review. The ONS CSP recorded-offence
  replacement is complete and is already displayed.

## Location expansion

Completed on 7 September 2026 at the user's request: 20 locations were added to
the canonical inputs, generated broad screen and UI. Each has a location
identity/centroid, HMLR all-flat sale proxy, July 2026 ONS one-bedroom LA rent
proxy, and separate ONS CSP violence-against-the-person and sexual-offence rates.
The raw HMLR, ONS rent and ONS crime artifacts and their source metadata are
retained in the repository's existing dated releases/snapshots.

The expansion entries are intentionally incomplete: transport, quiet and condition
observations have not been asserted, and therefore neither buying nor renting
composite score is calculated for them. The controlled 7 September 2026 market
stock captures are retained separately from the imported 5 September baseline;
missing values are displayed as unavailable, never as zero.

| Gap addressed | Status | Locations |
| --- | --- | --- |
| Major southern and south-west markets | Added | Bristol; Southampton; Bournemouth–Poole; Brighton & Hove; Exeter |
| South East and London-adjacent markets | Added | Reading; Milton Keynes; Luton; Southend-on-Sea |
| East of England | Added | Cambridge; Colchester |
| High-cost comparator cities | Added | Oxford; Bath |
| Underrepresented Welsh centres | Added | Bridgend; Llanelli; Bangor; Rhyl |
| Useful regional comparators | Added | York; Durham; Cheltenham |

London is a material coverage gap, but requires a separately agreed geography
before inclusion: a single London row is too coarse, while borough-scale rows
would change the current population-centre approach.
