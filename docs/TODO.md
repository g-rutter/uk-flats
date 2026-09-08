# Next work

- Complete the 20-place expansion cohort:
  - Complete the reviewed fixed-date National Rail request/response release for `nationalTransport.csv`; do not bypass station mapping, raw retention or review.
  - Agree an evidence-linked reviewer rubric for local transport, quiet and condition, then add reviewed rows to `localTransport.csv`, `quiet.csv` and `condition.csv`; do not infer bands from nearby places or treat deprivation as appearance.
- Audit every source, calculation and proxy for suitability, reproducibility and opportunities for more objective measures; record any resulting methodology changes and evidence limitations.
  - Is there a better measure of market thickness than rightmove listings?
  - Can we make the quietness, condition and local transport fields more objective and data driven?
  - Keep Police.uk ASB research-only unless a dated archive passes the documented force/month coverage and geography review.
  - What is simply being done in a stupid way - too much effort for the payoff perhaps?
- Re-acquire and document prices and rents for the original 63-location baseline; decide whether reproducible portal stock snapshots are sufficiently reliable to retain as a comparison input.
- Homogenise the original and existing location information such that there is no longer any reference in the repo that they are distinct. They should indeed be identical at this point. Identically acquired, uniformly recorded, methods of acquistion identical with no remaining mention of any differences in methodology because there are none. It should not be recorded that one part is an expansion and the other the original.
- Make end-to-end location additions and data refreshes agent-operable: document and automate the acquisition, validation, evidence, build and review workflow.
- Extend the map to colour locations by either the composite score or an individual score component.
- Add map overlays where suitably sourced evidence is available, beginning with noise or air pollution, recorded offences, market thickness and isochrone travel times.
- Repo health:
  - Thoroughly purge the code base of bloat in both code and natural language.
  - Look for fragmentation and unify the same processes or documentation being repeated
