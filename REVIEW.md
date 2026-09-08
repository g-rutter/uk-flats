# Repository review

Reviewed 6 September 2026. Scope: the active broad comparison only (not the
historical archive as a source of current findings). I read the README and
methodology, input schemas and evidence catalogue, build/composite/UI code and
tests, and rebuilt the outputs. `python3 scripts/build.py` and `python3 -m
unittest discover -s tests` both succeed (22 tests).

## Bottom line

This is a well-organised *broad-screening prototype* with unusually clear
warnings about what its measures are not. It is safe to say that it presents
the supplied numbers as the documented proxies. It is not yet possible to say
that most of the underlying non-crime numbers are accurate: the repository has
neither their raw downloads/snapshots nor the transformations that produced
them. The documentation itself correctly calls them imported historical claims.

The ONS recorded-offence data is materially stronger. It has source cells,
hashes, periods, populations, a reproducible transformation, coverage/residual
audits, and separately displayed violence and sexual-offence rates for all 63
locations. It still measures recorded offences in broad CSP geographies, not
the likelihood of feeling or being safe around a prospective flat.

The current composite looks more precise than its ingredients merit. In
particular, 60% of its weight is qualitative or a one-day portal snapshot
(local transport, condition, quietness and stock), while condition is marked
Low confidence for 42 of 63 places and quietness Medium for every place.
Treat it as a configurable triage aid, not a ranking or recommendation.

## Does each field say what it purports to say, and is it useful?

| Field | Assessment | How to make it more useful |
| --- | --- | --- |
| Location, local authority and coordinates | Useful identifiers and map anchors, but each coordinate is a place centre and not a boundary or a candidate-flat location. Several measures use a different geography from the displayed place. | Add stable ONS geography codes and an explicit `comparison_geography`/boundary type for every measure. Show geography mismatch prominently, especially where a named town uses an LA or CSP proxy. |
| Buy price and transaction count | The label is honest: it is a 24-month achieved median for all flat/maisonette sizes, not a one-bed price. Counts help judge stability. It is useful as a coarse price signal, but cannot answer the one-bed question or capture leasehold/service-charge differences. The HMLR raw extract and calculation are absent, so the actual values cannot be independently checked here. | Retain a dated PPD extract/query and transform; report one-bed sales where a defensible source exists, distribution/percentiles, £/m² where comparable, age of latest sale, property type/tenure exclusions, and a recent price trend. Display a warning where registrations are incomplete. |
| Rent | It accurately describes an ONS modelled one-bedroom LA mean, rather than a current asking-rent median. That is useful for long-run broad affordability, but not for what a renter can currently secure in the named town; LA boundaries can be much wider and the published series has no observation count here. | Separate “existing-stock modelled rent” from current new-let asking rents. Add a dated portal sample/snapshot with distribution and sample size, rent trend, LHA where relevant, and all-in monthly cost (council tax, utilities estimate, parking and service charge where known). Preserve the LA mapping. |
| One-bedroom listing count | The field honestly says it is a Rightmove headline count on 5 September 2026. It is a useful short-lived indication of advertised choice. It is not stock, liquidity, quality, price range or unique-property count; sale/rent searches use different exclusions and no result pages were retained. | Store query parameters, timestamp, result-page snapshot or IDs, and a repeatable collector where permitted. Report count, price distribution, age/price reductions, furnished status and explicit exclusions. Use a rolling median of several dates rather than one snapshot. |
| National rail time and changes | Representative, rounded planner observations to London and Birmingham are useful if those two destinations match the hunter's life. They are not a timetable, door-to-door journey, cost, frequency, reliability or accessibility measure. Birmingham necessarily receives a zero-minute journey to itself, which boosts it on this factor. | Let users choose destinations and departure windows; use station, walk/bus access, scheduled frequency, first/last service, typical fare and disruption/reliability where reliable data exists. Keep the date/time and routing assumptions per observation. |
| Local transport | The descriptions are candid broad judgements, but scores are inferred from three exact phrases (“dense multimodal”, “useful town/city”, “basic bus and rail”). This is an undocumented data encoding disguised as prose, not a measured comparison. | Store an explicit assessed band and rationale, or preferably measurable components: households/stops within a walk threshold, service frequency by day/evening, rail/tram access, journey times to selected centres, fares and step-free access. Keep prose as commentary, not computation input. |
| Quietness | The text makes only a coarse town-wide claim and should not be read as a flat-level noise assessment. It is potentially useful as a prompt for later research, but not strong enough for a 15% score weight. The score is also inferred from a small list of phrases; any new wording silently defaults to “mixed”. | Use mapped road/rail/airport/industrial noise exposure, night-time noise and distance-to-corridor measures with a stated geography. Show the result as “areas to investigate”, then require address-level checks, visits at relevant hours and building glazing/floor information. |
| Local condition | This is the weakest field for decision use. It is openly a low/medium-confidence subjective judgement, yet it has a 15% weight. Many explanations invoke deprivation even though deprivation is not physical condition; the methodology recognises that distinction but the data does not consistently enforce it. | Remove it from the default composite until it is decomposed. Possible separate, transparently named measures include public-realm/maintenance observations, vacancy, heritage/green-space access and housing stock condition. Do not turn deprivation or aesthetics into a universal “better place” score. |
| Recorded violence and sexual offences | These do say what they claim: ONS counts divided by named CSP population for Apr 2025–Mar 2026, displayed separately, with mapping and source cells retained. They are useful context, not personal-safety evidence. Broad CSPs conceal neighbourhood, time-of-day, visitor/commuter and reporting/recording differences; unallocated-force records are deliberately not assigned. | Do not collapse them into a “safe” label. Keep separate categories and show rate, count, geography, uncertainty and trend. After coverage review, add comparable small-area/LSOA or CSP measures for violence, robbery, burglary, vehicle crime and ASB; allow a user to select the concerns they value rather than impose equal weighting. Police data should be complemented, not replaced, by address-specific visits in daylight and at night, route checks and building-security information. CSEW can provide regional victimisation context but is too coarse for a town ranking. |

## Composite and presentation issues

These are the most consequential current implementation issues.

1. `scripts/composite.py` converts prose into scores by keyword matching. A
   semantically equivalent future description can receive a different score,
   and a local-transport description without one of three exact phrases becomes
   unknown. There are no unit tests for these rules. Store explicit assessment
   values if they must remain, test them, and keep source prose independent.

2. The composite gives the seven factors fixed 10–15% weights, including 15%
   each to low-confidence condition and unmeasured quietness. The displayed
   0.1-point scores and map bands encourage false precision. Prefer a faceted
   comparison with user-controlled weights/filter thresholds; otherwise show
   broad tiers and a sensitivity analysis rather than a default ranking.

3. Affordability is deliberately three bands (5/3/1), not a continuous measure.
   It is recalculated against the current candidate list, so adding a location
   can change existing scores/rankings without their data changing. This is
   acceptable for a relative screen but should be highly visible. Future ties
   at a third boundary are not handled as a group, unlike map-score ties, so
   equal values could receive different affordability scores depending on CSV
   order.

4. The safety factor takes equal quintile scores of two differently patterned
   categories, then uses 15% of both buy and rent scores. This is more honest
   than the previous count proxy, but a default equal weighting is still a
   preference choice, not an empirical safety model. Keep the raw rates more
   prominent than the derived score.

## Data that would add real flat-hunting value

Prioritise data that either changes affordability materially or can be connected
to a specific short-listed address later:

- Purchase affordability: deposit and mortgage payment scenarios, council tax,
  service charge/ground rent, lease length, EPC, building insurance/cladding and
  known major works. These often outweigh a modest difference in sale price.
- Rental affordability and availability: asking-rent percentiles, bills/council
  tax, furnished/unfurnished split, pet/parking/accessibility filters, time on
  market and repeat-listing indicators.
- Housing quality and risk: EPC distribution, flood risk, subsidence/mining
  risk where applicable, building age/type, conservation/planning constraints
  and broadband/mobile coverage. Clearly separate area-level signals from
  property-level due diligence.
- Daily life: door-to-door travel to user-selected destinations, frequency and
  fare, GP/dentist access, grocery/green-space/walkability and cycling safety.
  Schools, nightlife and cultural amenities should be optional preference
  filters, not universal scores.
- Change and stability: price/rent growth, supply turnover, planned major
  infrastructure/development and population/employment context, with dates and
  uncertainty. Avoid interpreting these as investment advice.

## Repository structure, reuse and size

The structure is sound. Canonical editable CSVs are separate from generated
outputs and the archival handover; the build uses only the standard library,
validates identities/orphans/basic numeric values, has no hard-coded location
count, and produces a static browser view. Adding a location with unknown data
is already straightforward and is covered by a test. The archive integrity hash
test is also a good safeguard.

It is therefore reusable for *adding a place to the schema and manually entering
known observations*. It is not yet reusable for a reliable annual refresh of the
main screen: the README explicitly says the price, rent, Rightmove, transport,
quietness and condition source acquisition cannot be regenerated from supplied
materials. Only the newer crime/ASB work approaches source-to-output
reproducibility. To make annual refreshes routine:

- Create one dated acquisition/normalisation step per source, retaining raw
  files or permitted snapshots, query parameters, observation date, source
  version/hash and row-level evidence ID.
- Add `evidence_id`, period, retrieval date, geography and method/version to
  every observation table. At present only crime observations link to an
  evidence record; the other topic rows have neither an evidence ID nor their
  own date/period. `sources.csv` provides URLs but no machine-verifiable link
  from a value to a particular source version.
- Move scoring bands/rubrics out of prose matching into explicit versioned
  fields/configuration. Add schema validation for required columns and allowed
  values, semantic tests for every score rule, and a small browser/DOM smoke
  test in addition to build determinism.
- Maintain a data dictionary that states unit, denominator, geography, period,
  refresh cadence and suitable/not-suitable use for every displayed field.

The tracked repository is not bloated: `.git` is about 4.8 MB; active inputs
are about 280 KB, derived data about 2.3 MB, the historical archive about 1.0
MB, and `web/` about 604 KB. The generated `web/data.js` is about 567 KB because
it embeds all data and source links; that is reasonable for an offline 63-place
explorer, though sources/evidence could later be deduplicated to reduce it.

There is, however, a significant working-tree hygiene/reproducibility issue:
`data/raw/crime/police-2026-09-05/2026-03.zip` is an untracked 1.6 GB file (the
only current untracked item). Documentation describes this Police.uk archive as
a checkpoint, but a clone cannot obtain it. Decide deliberately whether to keep
it in a versioned large-file store with a manifest and retrieval instructions,
or exclude it with an explicit `.gitignore` and make the acquisition command the
documented reproducible path. Do not silently leave it as untracked state.

## Suggested priority order

1. Make the default interface faceted and demote/remove low-confidence prose
   factors from the composite.
2. Establish reproducible acquisition and row-level provenance for buy, rent
   and listings, then refresh those first.
3. Replace prose-derived transport/quiet/condition scores with explicit,
   auditable measures or mark them research prompts only.
4. Resolve the 1.6 GB raw-archive lifecycle and add provenance/schema/rubric
   tests.
5. Extend safety as separate, geography-labelled indicators only after the
   coverage and mapping tests pass; never market it as a personal-safety score.

