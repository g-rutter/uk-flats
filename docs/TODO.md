# Next work

- Audit every source, calculation and proxy for suitability, reproducibility and opportunities for more objective measures; record any resulting methodology changes and evidence limitations.
  - Is there a better measure of market thickness than rightmove listings?
  - Improve the 'recorded offenses' field. It's meant to be a measure of personal safety against crime and harassment. Continue looking for external sources of this data that are suitable, free and easy to integrate. Consider combining multiple measures, including the current police data. Consider using the 'crime' domain from the English Indices of Deprivation, which is described as, "Risk of personal and material victimisation". (Is it available for Wales?)
  - Finish the documented Residential environment replacement: resolve the England–Wales noise/EPC compatibility decision, perform the planned sensitivity/outlier/correlation/country-domain review, and only then replace Local condition. See `docs/residential-environment-plan.md`.
  - What is simply being done in a stupid way - too much effort for the payoff perhaps?
- Re-acquire and document prices and rents for all locations; decide whether reproducible portal stock snapshots are sufficiently reliable to retain as a comparison input.
- Make end-to-end location additions and data refreshes agent-operable: document and automate the acquisition, validation, evidence, build and review workflow.
- Allow the map to colour locations by an individual score component.
- Add map overlays where suitably sourced evidence is available, beginning with noise or air pollution, recorded offences, market thickness and isochrone travel times.
- Repo health:
  - When possible, homogenise the original and existing location information such that there is no longer any reference in the repo that they are distinct. They should indeed be identical at this point. Identically acquired, uniformly recorded, methods of acquistion identical with no remaining mention of any differences in methodology because there are none. It should not be recorded that one part is an expansion and the other the original.
  - Thoroughly purge the code base of bloat in both code and natural language.
  - Look for fragmentation and unify the same processes or documentation being repeated
