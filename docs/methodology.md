# Broad comparison methodology

Keep all candidates in view. The current remit replaces the old shortlist/grades
plan. Broad price, stock, transport, quiet and condition data are in scope;
building, subarea and listing research are not. Buying and renting remain separate.

The migration imports historical numbers and assessments without refreshing or
endorsing them. It adds no source research. Old ordinal scores, composites,
priority weaknesses and shortlist decisions are excluded. Confidence labels and
reasons remain as historical assessments. No weighting or overall recommendation
is added; price sorting uses proxies only.

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
  locations. They are recorded-offence measures, not safety scores, and must not
  be combined or used to rank locations. Kettering and Northampton use their
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
