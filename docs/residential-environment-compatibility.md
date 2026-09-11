# Residential-environment England–Wales compatibility review

Review and decision date: 2026-09-10. This records the move from the mixed-scale
v2 pilot to `residential-environment-bua24-v3-country-calibrated`; it does not by
itself authorise the live factor switch before the remaining quality assurance.

## Finding

The retained 2025 noise and Energy Performance Certificate (EPC) observations
cannot be described as harmonised.
No published field in the retained releases reverses the differences exactly.

- England's Indices of Deprivation (IoD) noise indicator combines road, rail and major-airport exposure and
  applies shrinkage. Wales publishes road-and-rail exposure without a documented
  shrinkage step. Both use the 2021 strategic model, a 55 dB Lden threshold,
  building-level façade results and Census 2021 population.
- The EPC input is more closely aligned upstream than the earlier plan implied:
  the Ministry of Housing, Communities and Local Government (MHCLG) produced the
  imputed property-level observations for both countries with
  the same 2012–2024 records and nearest-neighbour method. Wales publishes the
  rounded, unshrunk Lower-layer Super Output Area (LSOA) mean Standard Assessment
  Procedure (SAP) score. England publishes `100 - mean SAP` after
  empirical-Bayes shrinkage. Subtracting the English field from 100 restores its
  direction, but not the unshrunk mean.

The public English road and rail GIS maps do not by themselves reproduce the
required English percentage. The official indicator uses building façade
receivers, dwelling allocation, population assignment, logarithmic source
combination and shrinkage. An OA-centroid overlay would be a new observation,
not a repair of the published one. Similarly, the public EPC register cannot
reproduce the all-property mean without the OS property base and the official
imputations. A harmonised replacement therefore requires new publisher-supplied
LSOA observations or a separately specified successor method and national
release.

Primary source checks:

- [English IoD 2025 technical report](https://assets.publishing.service.gov.uk/media/68ff59c80f801e57b5bef907/ID_2025_Technical_Report.pdf), sections 4.9.6–4.9.12 and 4.9.31–4.9.35;
- [WIMD 2025 housing technical report](https://www.gov.wales/welsh-index-multiple-deprivation-wimd-2025-technical-report-housing-domain-html), energy-efficiency section;
- [WIMD 2025 physical-environment technical report](https://www.gov.wales/welsh-index-multiple-deprivation-wimd-2025-technical-report-physical-environment-domain-html), noise section and annex 9.3; and
- [Defra 2022 strategic noise mapping](https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps), road and rail GIS description.

## Selected approximate transform and migration audit

`scripts/prepare_residential_environment.py` now generates
`data/derived/residential_environment_compatibility_audit.csv` from the retained
national Built-up Area (BUA) audit. A BUA represents the physical footprint of a
continuously built-up settlement rather than an administrative boundary. The
audit recalculates the quiet and housing percentiles within each
country, separately and together, then regenerates the England-and-Wales index
thresholds and all 83 candidate bands.

Version 3 selects the combined country-calibrated scenario. Country calibration
removes genuine England–Wales distribution differences as well as measurement
differences, so this is an approximate ordinal alignment rather than a claim that
the raw observations are harmonised. Cross-border BUAs are assigned to their
population-majority country for the national calculation; each project candidate
uses its recorded country. Raw noise percentages and EPC observations remain in
the canonical and audit outputs.

Results:

| Scenario | Unchanged candidates | +1 band | -1 band | Change over 1 band |
| --- | ---: | ---: | ---: | ---: |
| Quiet country-calibrated | 83 | 0 | 0 | 0 |
| Housing country-calibrated | 77 | 4 | 2 | 0 |
| Both country-calibrated | 76 | 4 | 3 | 0 |

Across the three scenarios, 75 candidates never change band and eight change in
at least one scenario. No candidate changes by more than one band. The combined
scenario changes Bangor, Cardiff, Rhyl and Swansea from their baseline bands
3/4/3/4 to 4/5/4/5, and Colchester, Northampton and Sheffield from 5/5/4 to
4/4/3. Merthyr Tydfil changes from 4 to 5 only in the housing-only scenario.

The quiet result suggests that the airport/scope difference does not determine a
candidate factor band under this country-level stress test. It does not prove
that individual airport-affected observations are unbiased. The housing result
shows a visible country-scale effect: the Welsh candidates' country-calibrated
housing percentiles are on average 8.436 points above their mixed-release
percentiles, compared with an average change of -0.338 among English candidates.
That effect reaches the final factor band for several candidates close to a
national threshold.

## Decision

The approximate country-percentile transform was selected on 2026-09-10. It is
used for both affected pillars because it is robust to shrinkage, rounding and
non-linear spacing without inventing unavailable raw observations. The former
mixed-scale result remains only as the baseline in the migration audit. The
compatibility blocker and subsequent research quality assurance are resolved;
the factor now replaces the former `condition` input.
