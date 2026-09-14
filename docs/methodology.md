# Broad comparison methodology

Keep all 90 candidates in view. Broad price, stock, transport, population and residential-environment
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

| Factor | Relative weight | Calculation |
| --- | ---: | --- |
| Housing cost | 15 | Within each tenure, fresh equal ninths of the current proxy distribution score 5, 4.5, 4, …, 1 from cheapest to most expensive. |
| Recorded-offence safety proxy | 15 | Equal mean of fresh 1--5 quintile scores for the Office for National Statistics (ONS) Community Safety Partnership (CSP) violence-against-the-person and sexual-offence rates; lower recorded rates score higher. |
| Local public-transport connectivity | 15 | Population-weighted mean of the Department for Transport (DfT) 2025 Census Output Area (OA) `Overall (public transport)` metric within each reviewed April 2024 Built-up Area (BUA) mapping. National population-weighted England-and-Wales quintiles score 1--5; higher is better. |
| Residential environment | 15 | Equal mean of population-weighted air, quiet, green-space and housing-energy percentiles. Fixed national population-weighted BUA quintiles score 1--5; higher is better. |
| One-bed stock | 15 | Current tenure-specific Rightmove headline counts of under 10, 10--24, 25--74, 75--249 and 250+ score 1--5. |
| National transport | 10 | London and Birmingham routes score 5, 4, 3, 2 or 1 at effective journey times (minutes plus 15 per change) of <=75, <=120, <=165, <=210 or >210. The two route scores are averaged. |

The weighted score is `100 * sum(weight * factor score / 5) / sum(weight)`, so
the configured weights are relative and do not need to total 100. All six inputs
must be known or the tenure score remains blank; missing data are never zero-filled.
With the current total relative weight of 85, a factor whose relative weight is
15 contributes 15/85, or about 17.6%, of the composite.
Confidence labels and buy transaction counts remain evidence context and do not
arbitrarily change scores. The browser shows the component values and raw measures.
Housing-cost half-point bands are recalculated independently for buying and renting from
all locations with a known proxy in the current candidate set. Equal proxy values
receive their shared mean rank and remain in the same band, so band counts
may differ slightly rather than assigning different scores to tied values. These
are relative, candidate-set-dependent scores: a location's score can change when
locations or observations change even if its own proxy does not.
The map and filters offer the same grouped measure catalogue. Score components
come first: the composite plus housing cost, recorded-offence safety, local
public transport, residential environment, one-bedroom stock and national
transport. The remaining feeds include their underlying observations and
contextual measures, including Census 2021 built-up-area population and Ofcom residential gigabit-capable broadband
availability, which is not a composite component.
Marker colours use a continuous gradient across the full candidate-set range;
filters do not rescale it. Measures where lower is preferable (cost, pollution,
noise, journey time, changes and recorded-offence rates) reverse the palette so
the favourable end remains green. The fixed Forest gradient changes presentation
only, not scores, table order or missing-data handling. The heat bar shows each
known location's position and identifies the selected location with its exact
displayed value. Unknown values remain neutral rather than being assigned a
numeric colour.

The local public-transport score uses a fixed national reference for the DfT
2025 release, not candidate ranks. Population-weighted OA cut-points are
53.70, 64.39, 71.48 and 79.48; equality enters the higher band. The browser
shows each settlement's 0--100 population-weighted value and national population
percentile. See the [full local transport methodology](local-transport-methodology.md)
for source fields, BUA mappings, weights, coverage checks and limitations.

The safety proxy is a limited comparison of recorded offences, not victimisation
risk, personal safety, or a neighbourhood measure. It excludes anti-social
behaviour (ASB): the Police.uk
archive lacks verified force/month completeness, including missing Greater
Manchester files, and has unassigned split/unmapped records. Add ASB only after a
dated archive and geography/coverage review supports comparable CSP rates.

- Buying: recorded 24-month HM Land Registry (HMLR) category-A flat/maisonette median across all sizes,
  with transaction count. The displayed whole-pound median rounds an exact .5
  midpoint up. Uses the Town/City field, except Torbay's district proxy.
- Renting: recorded July 2026 ONS one-bedroom modelled local-authority (LA) mean, not an asking median.
  No observation counts survive for this series. Town and LA boundaries differ.
- Stock: Rightmove headline counts are dated snapshots, not deduplicated listings.
  Their exact retrieval and resolver evidence vary by observation; consult the
  release audit and evidence catalogue. Bournemouth–Poole sums two named portal
  regions and may not exactly match the broad comparison geography.
- Population: Census 2021 usual residents summed across the Output Areas assigned
  to each reviewed April 2024 BUA. This is a consistent settlement count, not a
  current-year estimate or local-authority population. Census disclosure control
  can slightly perturb counts.
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
- Digital connectivity: Ofcom's provider-reported share of residential premises
  with gigabit-capable fixed-broadband availability in January 2025, aggregated
  from 2021 OAs to the reviewed April 2024 BUA using premise counts. It is
  availability, not observed or guaranteed speed, take-up, price, latency,
  reliability or in-home performance. It is plottable but unscored and excluded
  from both composites. See the
  [digital connectivity methodology](digital-connectivity-methodology.md).
- Residential environment: method
  `residential-environment-bua24-v3-country-calibrated` equally combines cleaner
  air, less modelled transport noise, OS Open Greenspace access and housing energy
  quality across the reviewed BUA. Air and green use the England-and-Wales national
  distribution; incompatible published quiet and EPC observations use
  population-weighted within-country percentiles. The resulting index uses fixed
  national population-weighted BUA thresholds of 37.719, 45.246, 53.483 and
  63.209. It is not a street, property, beauty, safety or general deprivation
  assessment. The browser shows the raw observations and their separate periods.
- Recorded offences: ONS CSP violence-against-the-person and sexual-offence rates
  per 1,000 mid-2024 residents for April 2025–March 2026 are shown for all 90
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
