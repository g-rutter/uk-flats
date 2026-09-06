# Broad comparison methodology

Keep all 63 candidates in view. Broad price, stock, transport, quiet and condition
data are in scope; building, subarea and listing research are not. Buying and
renting remain separate.

The current inputs import historical numbers and assessments without refreshing or
endorsing them. They add no source research. Confidence labels and reasons remain
historical assessments. Do not reuse archived scores, rankings or decisions.

## Composite score

The broad screen calculates separate 0--100 Buying and Renting composite scores.
They compare only the current location set and are not final grades, price advice,
or neighbourhood conclusions. The calculation is new: it does not use archived
scores, rankings, shortlists or decisions.

| Factor | Weight | Calculation |
| --- | ---: | --- |
| Affordability | 15 | Within each tenure, the cheapest, middle and most-expensive thirds of the current proxy distribution score 5, 3 and 1 respectively. |
| Recorded-offence safety proxy | 15 | Equal mean of fresh 1--5 quintile scores for the ONS CSP violence-against-the-person and sexual-offence rates; lower recorded rates score higher. |
| Local transport | 15 | The explicit `assessment` field maps `dense_multimodal`, `useful_bus_rail` and `basic_bus_rail` to 5, 4 and 3. |
| Local condition | 15 | The explicit `assessment` field maps `highest`, `favourable` and `mixed` to 5, 4 and 2. |
| Quiet | 15 | The explicit `assessment` field maps `persistent_noise`, `mixed_exposure` and `lower_intensity` to 2, 3 and 4. |
| One-bed stock | 15 | Current tenure-specific Rightmove headline counts of under 10, 10--24, 25--74, 75--249 and 250+ score 1--5. |
| National transport | 10 | London and Birmingham routes score 5, 4, 3, 2 or 1 at effective journey times (minutes plus 15 per change) of <=75, <=120, <=165, <=210 or >210. The two route scores are averaged. |

The weighted score is `sum(weight * factor score / 5)`. All seven inputs must be
known or the tenure score remains blank; missing data are never zero-filled.
Confidence labels and buy transaction counts remain evidence context and do not
arbitrarily change scores. The browser shows the component values and raw measures.
For the map only, each tenure's known scores are grouped into lowest, middle and
highest thirds. Tied scores stay together, so groups are as even as possible
without giving the same score different colours. This visual grouping does not
alter the score or table order. The inclusive score bounds for each group are
generated with the screen and displayed in the map key.

The safety proxy is a limited comparison of recorded offences, not victimisation
risk, personal safety, or a neighbourhood measure. It excludes ASB: the Police.uk
archive lacks verified force/month completeness, including missing Greater
Manchester files, and has unassigned split/unmapped records. Add ASB only after a
dated archive and geography/coverage review supports comparable CSP rates.

- Buying: recorded 24-month HMLR category-A flat/maisonette median across all sizes,
  with transaction count. Uses the Town/City field, except Torbay's district proxy.
- Renting: recorded July 2026 ONS one-bedroom modelled LA mean, not an asking median.
  No observation counts survive for this series. Town and LA boundaries differ.
- Stock: recorded 5 September 2026 Rightmove headline counts, not deduplicated listings.
- Transport: rounded historical representative rail times, plus qualitative local
  network assessments. These are not live timetables or accessibility measurements.
- Quiet/condition: inherited coarse judgements with an explicit assessment band,
  reason, evidence IDs and `broad-assessment-v1` method version. The reason is
  explanatory evidence and never controls the score. These are not measured
  exposure or neighbourhood quality. Deprivation is not equivalent to visual
  condition.
- Recorded offences: ONS CSP violence-against-the-person and sexual-offence rates
  per 1,000 mid-2024 residents for April 2025–March 2026 are shown for all 63
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

## Crime research

[Crime replacement](crime-replacement.md) records the review decision. ONS CSP data
supplies the displayed separate offence rates. Police.uk ASB records are aggregated
to PFA/CSP using a reusable archive-and-lookup pipeline, but remain research-only
pending coverage review.
