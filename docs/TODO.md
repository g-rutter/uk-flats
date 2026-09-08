# Next work

- Complete the outstanding location records:
  - Agree an evidence-linked reviewer rubric for local transport, quiet and condition, then add reviewed rows to `localTransport.csv`, `quiet.csv` and `condition.csv`; do not infer bands from nearby places or treat deprivation as appearance.
- Audit every source, calculation and proxy for suitability, reproducibility and opportunities for more objective measures; record any resulting methodology changes and evidence limitations.
  - Is there a better measure of market thickness than rightmove listings?
  - Can we make the quietness, condition and local transport fields more objective and data driven?
  - Keep Police.uk ASB research-only unless a dated archive passes the documented force/month coverage and geography review.
  - What is simply being done in a stupid way - too much effort for the payoff perhaps?
- Re-acquire and document prices and rents for all locations; decide whether reproducible portal stock snapshots are sufficiently reliable to retain as a comparison input.
- Make end-to-end location additions and data refreshes agent-operable: document and automate the acquisition, validation, evidence, build and review workflow.
- Extend the map to colour locations by either the composite score or an individual score component.
- Add map overlays where suitably sourced evidence is available, beginning with noise or air pollution, recorded offences, market thickness and isochrone travel times.
- Repo health:
  - Continue provenance normalisation. The canonical schema and methodology are
    uniform, and cohort labels have been removed from active documentation. Do not
    erase the per-observation audit distinction until retained raw artifacts make
    the evidence genuinely equivalent.
  - Purged stale review material and duplicate helper code; keep removing only
    superseded material, not evidence or reproducibility controls.
  - Shared CSV serialization is now centralised. Continue to consolidate a process
    only when its input, output and review gate are genuinely the same.
