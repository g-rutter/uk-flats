# Next work

- Review the chosen per-location fields of information which go into the composite score. Are these useful, suitable for the purpose, being interpreted correctly, easy enough to maintain, and consistent in their meaning across locations? Do they exclude information that may be relevant? Some more specific questions:
  - Obtaining market thickness through rightmove queries is token-expensive and biased. What other alternatives exist to this?
  - It seems that some other fields may merely proxy area size or population in a location. Examples include 'Green space within 1,000m' and 'One-bedroom listings'. Are there more cases? How can these be made fair for comparison?
  - Identify work that adds little decision value relative to its collection or maintenance cost.
  - Improve the recorded-offence safety proxy beyond the complete ONS CSP violence-against-the-person and sexual-offence rates where a free, England-and-Wales-comparable, documented source supports it. Consider the English Indices of Deprivation crime domain only alongside a compatible Welsh measure and an explicit geography review. Keep Police.uk ASB research-only unless a dated archive passes the documented force/month coverage and geography review.
  - The 'green space' metrics seems totally misleading - places in the countryside get a bad score due to lack of parks despite being surrounded by nature
- Re-acquire and document buying prices, rents, national-transport observations and market-stock snapshots for all 90 locations. The seven newest locations now have reproducible July 2026 LA rent proxies and dated market-stock snapshots, and five have reproducible HMLR named-place buying proxies; Newbridge and Hay-on-Wye still lack compatible buying geographies. All seven still lack national-transport observations. The existing price, rent and national-transport inputs are otherwise largely imported baseline observations, and 63 older market observations also lack retained row-level captures. Promote a replacement only after its raw release, geography mapping, evidence and validation are complete.
- Complete an agent-operable, end-to-end workflow for adding locations and refreshing each source: acquisition, raw-release retention, geography mapping, preparation, evidence, validation, build and browser review.
- Add map overlays where suitably sourced evidence is available, beginning with noise or air pollution, recorded offences, market thickness and isochrone travel times.
- Repo health:
  - Remove stale distinctions between location cohorts from active inputs and methodology, while preserving required archive and imported-baseline provenance until every affected observation is reproducibly replaced.
  - Purge unnecessary code and prose.
  - Consolidate duplicated processes and documentation.
