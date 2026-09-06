# Broad comparison methodology

Keep all 63 candidates in view. Broad price, stock, transport, quiet and condition
data are in scope; building, subarea and listing research are not. Buying and
renting remain separate.

The current inputs import historical numbers and assessments without refreshing or
endorsing them. They add no source research. Confidence labels and reasons remain
historical assessments. Do not reuse archived scores, rankings or decisions.

## Future composite score

No composite score is currently defined. Before adding one to the map, decide and
document its purpose, buy/rent treatment, inputs, missing-data policy, weighting,
confidence treatment and presentation. It must be newly calculated from current
inputs, rather than inherited from the archive.

- Buying: recorded 24-month HMLR category-A flat/maisonette median across all sizes,
  with transaction count. Uses the Town/City field, except Torbay's district proxy.
- Renting: recorded July 2026 ONS one-bedroom modelled LA mean, not an asking median.
  No observation counts survive for this series. Town and LA boundaries differ.
- Stock: recorded 5 September 2026 portal headline counts, not deduplicated listings.
  Tower stock remains unverified; do not require tower availability for inclusion.
- Transport: rounded historical representative rail times, plus qualitative local
  network assessments. These are not live timetables or accessibility measurements.
- Quiet/condition: inherited coarse judgements with reasons; not measured exposure
  or neighbourhood quality. Deprivation is not equivalent to visual condition.
- Recorded offences: separate ONS CSP violence-against-the-person and sexual-offence
  rates per 1,000 mid-2024 residents for April 2025–March 2026 are shown for all 63
  locations. They are recorded-offence measures, not direct measures of safety.
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
