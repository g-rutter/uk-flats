# Crime review decision

Review date: 2026-09-06. Scope: the 63 existing broad-screen locations only.

## Decision

Display the two ONS CSP recorded-offence rates separately for all 63 locations:
violence against the person and sexual offences per 1,000 mid-2024 residents, for
April 2025 to March 2026. They are comparable enough for this limited CSP-proxy
display because each numerator is a published named-CSP cell and each denominator
is the matching published CSP population. The build recomputes the rates and
checks them against the published rates within the stated population rounding
interval.

The documented broad-screen methodology now combines fresh, equally weighted
quintile bands from these two rates into a limited recorded-offence safety proxy.
It does not claim to measure victimisation risk or personal safety. The rates and
proxy remain affected by reporting, recording practice, visitors and commuters,
and CSP/town boundary mismatch. Kettering and Northampton are shown from their
directly named ONS CSP rows and matching CSP populations; no whole-LA numerator,
population or allocation is used despite the dated relationship lookup showing
each LA spans multiple CSPs.

## Residual review

`data/derived/crime_residual_audit.csv` has five material force/category
residuals: South Yorkshire sexual offences (6.819%), Humberside violence (9.349%)
and sexual offences (9.163%), Cambridgeshire sexual offences (6.090%), and
Gloucestershire sexual offences (14.267%). These are force totals not represented
by named CSP rows; they are not allocated to, or subtracted from, the displayed
CSP numerators. The affected screen CSP figures retain their direct source cells,
populations and provenance. The residuals therefore remain an explicit limitation
and QA record, rather than a reason to alter a CSP rate.

## Outlier review

The twelve rows in `data/derived/crime_outlier_audit.csv` are the three low and
three high available rates for each category. Their source-cell and population
reconciliation checks pass. The extreme locations are retained as contextual
values, with no high/low label in the browser; none requires imputation or
exclusion.

## ASB decision

Do not display Police.uk ASB. The aggregation has 96,558 unmapped or split
records, no independently verified force/month completeness, and no Manchester
force files in the retained archive. Its counts therefore cannot be presented as
a comparable companion rate. Keep the raw archive, aggregation outputs and lookup
pipeline for a future dated, coverage-reviewed acquisition.
