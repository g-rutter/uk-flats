# Broad comparison methodology

Keep all 83 candidates in view. Broad price, stock, transport, quiet and condition
data are in scope; building, subarea and listing research are not. Buying and
renting remain separate.

All locations use the same canonical tables and scoring method. The release audit
records provenance completeness for each location/topic: missing retained raw
artifacts remain a limitation of that observation, never a reason to alter or
zero-fill it. Do not reuse archived scores, rankings or decisions.

## Composite score

The broad screen calculates separate 0--100 Buying and Renting composite scores.
They compare only the current location set and are not final grades, price advice,
or neighbourhood conclusions. The calculation is new: it does not use archived
scores, rankings, shortlists or decisions.

| Factor | Weight | Calculation |
| --- | ---: | --- |
| Housing cost | 15 | Within each tenure, fresh equal quintiles of the current proxy distribution score 5, 4, 3, 2 and 1 from cheapest to most expensive. |
| Recorded-offence safety proxy | 15 | Equal mean of fresh 1--5 quintile scores for the ONS CSP violence-against-the-person and sexual-offence rates; lower recorded rates score higher. |
| Local public-transport connectivity | 15 | Population-weighted mean of the DfT 2025 OA `Overall (public transport)` metric within each reviewed April 2024 BUA mapping. National population-weighted England-and-Wales quintiles score 1--5; higher is better. |
| Local condition | 15 | The explicit `assessment` field maps `highest`, `favourable` and `mixed` to 5, 4 and 2. |
| Quiet | 15 | The explicit `assessment` field maps `persistent_noise`, `mixed_exposure` and `lower_intensity` to 2, 3 and 4. |
| One-bed stock | 15 | Current tenure-specific Rightmove headline counts of under 10, 10--24, 25--74, 75--249 and 250+ score 1--5. |
| National transport | 10 | London and Birmingham routes score 5, 4, 3, 2 or 1 at effective journey times (minutes plus 15 per change) of <=75, <=120, <=165, <=210 or >210. The two route scores are averaged. |

The weighted score is `sum(weight * factor score / 5)`. All seven inputs must be
known or the tenure score remains blank; missing data are never zero-filled.
Confidence labels and buy transaction counts remain evidence context and do not
arbitrarily change scores. The browser shows the component values and raw measures.
Housing-cost quintiles are recalculated independently for buying and renting from
all locations with a known proxy in the current candidate set. Equal proxy values
receive their shared mean rank and remain in the same quintile, so bucket counts
may differ slightly rather than assigning different scores to tied values. These
are relative, candidate-set-dependent scores: a location's score can change when
locations or observations change even if its own proxy does not.
For the map only, each tenure's known scores are grouped into lowest, middle and
highest thirds. Tied scores stay together, so groups are as even as possible
without giving the same score different colours. This visual grouping does not
alter the score or table order. The inclusive score bounds for each group are
generated with the screen and displayed in the map key.

The local public-transport score uses a fixed national reference for the DfT
2025 release, not candidate ranks. Population-weighted OA cut-points are
53.70, 64.39, 71.48 and 79.48; equality enters the higher band. The browser
shows each settlement's 0--100 population-weighted value and national population
percentile. See the [full local transport methodology](local-transport-methodology.md)
for source fields, BUA mappings, weights, coverage checks and limitations.

The safety proxy is a limited comparison of recorded offences, not victimisation
risk, personal safety, or a neighbourhood measure. It excludes ASB: the Police.uk
archive lacks verified force/month completeness, including missing Greater
Manchester files, and has unassigned split/unmapped records. Add ASB only after a
dated archive and geography/coverage review supports comparable CSP rates.

- Buying: recorded 24-month HMLR category-A flat/maisonette median across all sizes,
  with transaction count. The displayed whole-pound median rounds an exact .5
  midpoint up. Uses the Town/City field, except Torbay's district proxy.
- Renting: recorded July 2026 ONS one-bedroom modelled LA mean, not an asking median.
  No observation counts survive for this series. Town and LA boundaries differ.
- Stock: Rightmove headline counts are dated snapshots, not deduplicated listings.
  Their exact retrieval and resolver evidence vary by observation; consult the
  release audit and evidence catalogue. Bournemouth–Poole sums two named portal
  regions and may not exactly match the broad comparison geography.
- Local public-transport connectivity: DfT's modelled 0--100 scheduled opportunity
  to reach employment, services and social engagements, aggregated from 2021 OAs
  to reviewed April 2024 built-up areas using Census 2021 population. The retained
  national thresholds are 53.70, 64.39, 71.48 and 79.48; equality enters the
  higher band. The browser shows the one-decimal raw value and population-weighted
  national percentile. This is not a measure of fares, crowding, reliability,
  accessibility or travel from a particular home.
- National transport: dated representative station-to-station journeys to London
  and Birmingham. This deliberately answers a different question and is scored
  independently of local connectivity.
- Quiet/condition: inherited coarse judgements with an explicit assessment band,
  reason, evidence IDs and `broad-assessment-v1` method version. The reason is
  explanatory evidence and never controls the score. These are not measured
  exposure or neighbourhood quality. Deprivation is not equivalent to visual
  condition.
- Recorded offences: ONS CSP violence-against-the-person and sexual-offence rates
  per 1,000 mid-2024 residents for April 2025–March 2026 are shown for all 83
  locations and are the limited recorded-offence component of the composite score.
  They are not direct measures of safety.
  Kettering and Northampton use their
  directly named CSP rows and matching CSP populations, rather than whole-LA
  values. ASB remains excluded because the Police.uk archive has incomplete
  force/month coverage.

See the evidence CSV for recorded periods and limitations. Geographies and periods
remain explicit rather than implicitly harmonised. This attempt reproducibly
transforms surviving summaries; original-source acquisition is still needed for
full source-to-output reproducibility.

See [local public-transport methodology](local-transport-methodology.md) for the
retained release, geography review, aggregation, thresholds and refresh controls.

## Crime research

[Crime replacement](crime-replacement.md) records the review decision. ONS CSP data
supplies the displayed separate offence rates. Police.uk ASB records are aggregated
to PFA/CSP using a reusable archive-and-lookup pipeline, but remain research-only
pending coverage review.
