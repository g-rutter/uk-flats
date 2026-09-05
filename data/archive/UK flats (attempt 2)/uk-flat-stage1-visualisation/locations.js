window.STAGE1_DATA = {
  "meta": {
    "title": "UK one-bedroom flat locations — Stage 1 broad screen",
    "stage": "Stage 1 broad screen",
    "locationCount": 63,
    "retrievalDate": "2026-09-05",
    "weights": {
      "affordability": 15,
      "safety": 15,
      "localTransport": 15,
      "condition": 15,
      "quiet": 15,
      "stock": 15,
      "nationalTransport": 10
    },
    "buyProxy": "24-month achieved all-flat median (not one-bedroom)",
    "rentProxy": "ONS one-bedroom modelled average (not a new-let asking median)",
    "cautions": [
      "Screening scores are preliminary relative scores, not final A–E grades.",
      "Buying affordability is an all-flat achieved-price proxy, not a one-bedroom purchase median.",
      "Rent is an official one-bedroom modelled average for the local authority, not a new-let asking median.",
      "Crime is a fixed one-mile centre indicator and is not population-normalised or neighbourhood evidence.",
      "One-bedroom market counts are a single Rightmove snapshot and may include duplicates or portal-boundary effects.",
      "Tower/high-rise availability is unresolved at Stage 1; all tower signals are Unclear.",
      "Quiet and local condition are deliberately coarse town/city-level judgements.",
      "National journey times are representative rounded weekday screening values and should be rechecked for travel planning."
    ]
  },
  "locations": [
    {
      "id": "barnsley",
      "name": "Barnsley",
      "country": "England",
      "localAuthority": "Barnsley",
      "lat": 53.553523,
      "lon": -1.482593,
      "safety": {
        "violenceSexualIndicator": 2047,
        "asbIndicator": 851,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2047 violence/sexual-offence and 851 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 100000,
        "transactions": 214,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 25,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 66.5,
        "priorityScore": 51,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 214 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 505,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 21,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 63.5,
        "priorityScore": 51,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Barnsley LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 25 sale and 21 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "High",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 145,
        "londonChanges": 1,
        "birminghamMinutes": 105,
        "birminghamChanges": 1,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Barnsley: London 145 min (1 change), Birmingham 105 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Major radial roads, rail and nearby M1 create exposed corridors, but this is a mixed town-wide noise screen."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "Industrial legacy and uneven renewal make the overall fabric less consistently cared-for; this is a coarse judgement."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Barnsley",
          "https://api.postcodes.io/postcodes?lon=-1.482593&lat=53.553523&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.553523&lng=-1.482593&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E108&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E108&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Barnsley"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.travelsouthyorkshire.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Barnsley%2C%20UK"
        ]
      }
    },
    {
      "id": "birmingham",
      "name": "Birmingham",
      "country": "England",
      "localAuthority": "Birmingham",
      "lat": 52.479284,
      "lon": -1.902941,
      "safety": {
        "violenceSexualIndicator": 7628,
        "asbIndicator": 985,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 2,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 7628 violence/sexual-offence and 985 ASB records in 12 months; relative composite places it in screening band 2/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 150000,
        "transactions": 3183,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 854,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 62.5,
        "priorityScore": 39,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 3183 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 825,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 1257,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 62.5,
        "priorityScore": 39,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Birmingham LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 854 sale and 1257 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 5,
        "confidence": "High",
        "reason": "Broad screen indicates a dense multimodal network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 82,
        "londonChanges": 0,
        "birminghamMinutes": 0,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Birmingham New Street: London 82 min (0 changes), Birmingham 0 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Dense road and rail corridors, airport influence and a large nightlife core make persistent noise exposure comparatively likely."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Major renewed central districts coexist with extensive uneven and deprived urban fabric, producing a mixed city-wide judgement."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Birmingham",
          "https://api.postcodes.io/postcodes?lon=-1.902941&lat=52.479284&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.479284&lng=-1.902941&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E162&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E162&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Birmingham"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.tfwm.org.uk/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Birmingham%2C%20UK"
        ]
      }
    },
    {
      "id": "blackburn",
      "name": "Blackburn",
      "country": "England",
      "localAuthority": "Blackburn with Darwen",
      "lat": 53.750073,
      "lon": -2.481528,
      "safety": {
        "violenceSexualIndicator": 2399,
        "asbIndicator": 1597,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 3,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2399 violence/sexual-offence and 1597 ASB records in 12 months; relative composite places it in screening band 3/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 110000,
        "transactions": 141,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 8,
        "marketScore": 1,
        "stockScore": 1,
        "screenScore": 57,
        "priorityScore": 48,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 141 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 534,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 2,
        "marketScore": 1,
        "stockScore": 1,
        "screenScore": 57,
        "priorityScore": 48,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Blackburn with Darwen LA; underlying observation count is not published in the table and the LA is broader than the named town."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 8 sale and 2 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 170,
        "londonChanges": 1,
        "birminghamMinutes": 135,
        "birminghamChanges": 1,
        "score": 3,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Blackburn: London 170 min (1 change), Birmingham 135 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "The M65, arterial roads and rail create noisy corridors, while much of the wider urban area is less intensively active."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "Strong heritage assets are offset by visibly uneven town-centre and industrial-era fabric in this broad proxy assessment."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Blackburn",
          "https://api.postcodes.io/postcodes?lon=-2.481528&lat=53.750073&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.750073&lng=-2.481528&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E167&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E167&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Blackburn"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Blackburn%2C%20UK"
        ]
      }
    },
    {
      "id": "blackpool",
      "name": "Blackpool",
      "country": "England",
      "localAuthority": "Blackpool",
      "lat": 53.82086,
      "lon": -3.051542,
      "safety": {
        "violenceSexualIndicator": 5053,
        "asbIndicator": 2641,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 1,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 5053 violence/sexual-offence and 2641 ASB records in 12 months; relative composite places it in screening band 1/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 80000,
        "transactions": 297,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 77,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 58.5,
        "priorityScore": 42,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 297 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 498,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 75,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 58.5,
        "priorityScore": 42,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Blackpool LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 77 sale and 75 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 185,
        "londonChanges": 1,
        "birminghamMinutes": 130,
        "birminghamChanges": 1,
        "score": 3,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Blackpool North: London 185 min (1 change), Birmingham 130 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Visitor traffic, entertainment/nightlife and the promenade corridor raise evening and seasonal noise risk."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "Distinctive resort heritage is offset by concentrated deprivation and uneven upkeep, so pleasantness is not consistent town-wide."
      },
      "seriousPriorityWeaknesses": 1,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Blackpool",
          "https://api.postcodes.io/postcodes?lon=-3.051542&lat=53.820860&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.820860&lng=-3.051542&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E168&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E168&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Blackpool"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.blackpooltransport.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Blackpool%2C%20UK"
        ]
      }
    },
    {
      "id": "bolton",
      "name": "Bolton",
      "country": "England",
      "localAuthority": "Bolton",
      "lat": 53.577709,
      "lon": -2.431041,
      "safety": {
        "violenceSexualIndicator": null,
        "asbIndicator": null,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": null,
        "confidence": "Low",
        "reason": "Unknown: Greater Manchester Police crime data are unavailable on Police.uk; sparse point-query returns are cross-force records and cannot support a comparable indicator."
      },
      "buy": {
        "proxyMedian": 114000,
        "transactions": 493,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 64,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 60.588235294117645,
        "priorityScore": 45,
        "confidenceComposite": 2,
        "unknowns": 1,
        "affordabilityReason": "Median of 493 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 647,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 78,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 64.11764705882354,
        "priorityScore": 45,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 1,
        "affordabilityReason": "Official one-bedroom modelled average for Bolton LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 64 sale and 78 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 155,
        "londonChanges": 1,
        "birminghamMinutes": 110,
        "birminghamChanges": 1,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Bolton: London 155 min (1 change), Birmingham 110 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "M61 access, busy radial roads and rail create local noise pressure, with quieter residential parts away from them."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "Civic and heritage pockets coexist with substantial deprived and uneven post-industrial fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Bolton",
          "https://api.postcodes.io/postcodes?lon=-2.431041&lat=53.577709&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.577709&lng=-2.431041&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/",
          "https://data.police.uk/changelog/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E182&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E182&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Bolton"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://tfgm.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Bolton%2C%20UK"
        ]
      }
    },
    {
      "id": "bradford",
      "name": "Bradford",
      "country": "England",
      "localAuthority": "Bradford",
      "lat": 53.790778,
      "lon": -1.754561,
      "safety": {
        "violenceSexualIndicator": 5287,
        "asbIndicator": 978,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 2,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 5287 violence/sexual-offence and 978 ASB records in 12 months; relative composite places it in screening band 2/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 99000,
        "transactions": 453,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 76,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 61.5,
        "priorityScore": 45,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 453 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 553,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 91,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 61.5,
        "priorityScore": 45,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Bradford LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 76 sale and 91 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 170,
        "londonChanges": 1,
        "birminghamMinutes": 145,
        "birminghamChanges": 1,
        "score": 3,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Bradford Interchange: London 170 min (1 change), Birmingham 145 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Dense radial traffic, rail corridors, industry and a sizeable nightlife centre make quietness inconsistent."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "High-quality historic architecture is offset by vacancy, deprivation and uneven upkeep across the built-up area."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Bradford",
          "https://api.postcodes.io/postcodes?lon=-1.754561&lat=53.790778&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.790778&lng=-1.754561&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E198&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E198&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Bradford"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.wymetro.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Bradford%2C%20UK"
        ]
      }
    },
    {
      "id": "burnley",
      "name": "Burnley",
      "country": "England",
      "localAuthority": "Burnley",
      "lat": 53.787517,
      "lon": -2.24439,
      "safety": {
        "violenceSexualIndicator": 2417,
        "asbIndicator": 1565,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 3,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2417 violence/sexual-offence and 1565 ASB records in 12 months; relative composite places it in screening band 3/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 88625,
        "transactions": 98,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 5,
        "marketScore": 1,
        "stockScore": 1,
        "screenScore": 57,
        "priorityScore": 48,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Median of 98 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 463,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 22,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 58.5,
        "priorityScore": 48,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Burnley LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 5 sale and 22 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 190,
        "londonChanges": 2,
        "birminghamMinutes": 155,
        "birminghamChanges": 2,
        "score": 3,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Burnley Manchester Road: London 190 min (2 changes), Birmingham 155 min (2 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "M65, rail and industrial corridors are conspicuous, but the town is less continuously busy than a major city."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "Industrial heritage and nearby landscape are positives, but deprivation and uneven town-centre fabric weaken the broad condition score."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Burnley",
          "https://api.postcodes.io/postcodes?lon=-2.244390&lat=53.787517&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.787517&lng=-2.244390&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E252&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E252&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Burnley"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Burnley%2C%20UK"
        ]
      }
    },
    {
      "id": "burton-on-trent",
      "name": "Burton-on-Trent",
      "country": "England",
      "localAuthority": "East Staffordshire",
      "lat": 52.807376,
      "lon": -1.644791,
      "safety": {
        "violenceSexualIndicator": 1710,
        "asbIndicator": 499,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 5,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 1710 violence/sexual-offence and 499 ASB records in 12 months; relative composite places it in screening band 5/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 104000,
        "transactions": 147,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 26,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 71.5,
        "priorityScore": 54,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 147 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 610,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 34,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 65.5,
        "priorityScore": 48,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for East Staffordshire LA; underlying observation count is not published in the table and the LA is broader than the named town."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 26 sale and 34 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 95,
        "londonChanges": 1,
        "birminghamMinutes": 30,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Burton-on-Trent: London 95 min (1 change), Birmingham 30 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "The A38, railways and major brewing/industrial activity create conspicuous transport and industrial noise corridors."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "A serviceable centre and riverside assets are balanced by traffic-dominated and industrial urban fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Burton%20upon%20Trent",
          "https://api.postcodes.io/postcodes?lon=-1.644791&lat=52.807376&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.807376&lng=-1.644791&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E256&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E256&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords="
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Burton-on-Trent%2C%20UK"
        ]
      }
    },
    {
      "id": "cardiff",
      "name": "Cardiff",
      "country": "Wales",
      "localAuthority": "Cardiff",
      "lat": 51.480005,
      "lon": -3.176855,
      "safety": {
        "violenceSexualIndicator": 4514,
        "asbIndicator": 1753,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 2,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 4514 violence/sexual-offence and 1753 ASB records in 12 months; relative composite places it in screening band 2/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 165000,
        "transactions": 1883,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 259,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 63.5,
        "priorityScore": 42,
        "confidenceComposite": 2.2857142857142856,
        "unknowns": 0,
        "affordabilityReason": "Median of 1883 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 902,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 468,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 63.5,
        "priorityScore": 42,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Cardiff LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 259 sale and 468 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 5,
        "confidence": "High",
        "reason": "Broad screen indicates a dense multimodal network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 110,
        "londonChanges": 0,
        "birminghamMinutes": 120,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Cardiff Central: London 110 min (0 changes), Birmingham 120 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Capital-city traffic, dense rail approaches, major events and nightlife make central noise exposure comparatively likely."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Substantial civic, park and renewed waterfront assets make the city broadly pleasant despite uneven inner corridors."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Cardiff",
          "https://api.postcodes.io/postcodes?lon=-3.176855&lat=51.480005&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=51.480005&lng=-3.176855&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E281&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E281&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Cardiff"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://tfw.wales/"
        ],
        "environment": [
          "https://datamap.gov.wales/layergroups/geonode%3AEnvironmental_Noise_Mapping_2022",
          "https://stats.gov.wales/en-GB/c67b9e08-dacc-439a-a244-2fce79b11400",
          "https://www.openstreetmap.org/search?query=Cardiff%2C%20UK"
        ]
      }
    },
    {
      "id": "chester",
      "name": "Chester",
      "country": "England",
      "localAuthority": "Cheshire West and Chester",
      "lat": 53.190204,
      "lon": -2.891644,
      "safety": {
        "violenceSexualIndicator": 1929,
        "asbIndicator": 438,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 5,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 1929 violence/sexual-offence and 438 ASB records in 12 months; relative composite places it in screening band 5/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 165000,
        "transactions": 570,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 43,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 72.5,
        "priorityScore": 57,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 570 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 721,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 54,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 72.5,
        "priorityScore": 57,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Cheshire West and Chester LA; underlying observation count is not published in the table and the LA is broader than the named town."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 43 sale and 54 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 125,
        "londonChanges": 0,
        "birminghamMinutes": 75,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Chester: London 125 min (0 changes), Birmingham 75 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 4,
        "confidence": "Medium",
        "reason": "The A55 and railways are clear noise sources, but the compact city has many areas away from intensive urban activity."
      },
      "condition": {
        "score": 5,
        "confidence": "Medium",
        "reason": "Exceptional historic fabric, river setting and generally strong public realm support a strongly favourable broad judgement."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Chester",
          "https://api.postcodes.io/postcodes?lon=-2.891644&lat=53.190204&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.190204&lng=-2.891644&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E313&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E313&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Chester"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Chester%2C%20UK"
        ]
      }
    },
    {
      "id": "chesterfield",
      "name": "Chesterfield",
      "country": "England",
      "localAuthority": "Chesterfield",
      "lat": 53.23633,
      "lon": -1.429206,
      "safety": {
        "violenceSexualIndicator": 1799,
        "asbIndicator": 878,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 1799 violence/sexual-offence and 878 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 115500,
        "transactions": 204,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 14,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 65.5,
        "priorityScore": 51,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 204 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 538,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 31,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 74.5,
        "priorityScore": 57,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Chesterfield LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 14 sale and 31 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 115,
        "londonChanges": 0,
        "birminghamMinutes": 65,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Chesterfield: London 115 min (0 changes), Birmingham 65 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "The A61, rail and industrial corridors bring noise, while the town's scale leaves plausible calmer areas."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "A coherent historic centre and nearby landscape support a favourable judgement despite some post-industrial and arterial-road fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Chesterfield",
          "https://api.postcodes.io/postcodes?lon=-1.429206&lat=53.236330&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.236330&lng=-1.429206&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E315&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E315&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Chesterfield"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Chesterfield%2C%20UK"
        ]
      }
    },
    {
      "id": "coventry",
      "name": "Coventry",
      "country": "England",
      "localAuthority": "Coventry",
      "lat": 52.407707,
      "lon": -1.506857,
      "safety": {
        "violenceSexualIndicator": 4663,
        "asbIndicator": 555,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 3,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 4663 violence/sexual-offence and 555 ASB records in 12 months; relative composite places it in screening band 3/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 135000,
        "transactions": 830,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 88,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 65.5,
        "priorityScore": 45,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 830 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 759,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 184,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 59.5,
        "priorityScore": 39,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Coventry LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 88 sale and 184 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 60,
        "londonChanges": 0,
        "birminghamMinutes": 20,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Coventry: London 60 min (0 changes), Birmingham 20 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "The inner ring road, motorway approaches, rail and a substantial night-time economy create widespread noise pressure."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Major public-realm renewal and heritage pockets coexist with traffic-heavy and uneven reconstructed urban fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Coventry",
          "https://api.postcodes.io/postcodes?lon=-1.506857&lat=52.407707&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.407707&lng=-1.506857&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E368&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E368&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Coventry"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.tfwm.org.uk/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Coventry%2C%20UK"
        ]
      }
    },
    {
      "id": "darlington",
      "name": "Darlington",
      "country": "England",
      "localAuthority": "Darlington",
      "lat": 54.523274,
      "lon": -1.553611,
      "safety": {
        "violenceSexualIndicator": 2195,
        "asbIndicator": 1576,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 3,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2195 violence/sexual-offence and 1576 ASB records in 12 months; relative composite places it in screening band 3/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 95000,
        "transactions": 220,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 23,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 64.5,
        "priorityScore": 54,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 220 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 494,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 24,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 64.5,
        "priorityScore": 54,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Darlington LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 23 sale and 24 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 135,
        "londonChanges": 0,
        "birminghamMinutes": 145,
        "birminghamChanges": 1,
        "score": 3,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Darlington: London 135 min (0 changes), Birmingham 145 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "A1(M)/A66 approaches and a major rail corridor are conspicuous, but the town is not continuously high-intensity."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Victorian and civic assets are balanced by ordinary and sometimes uneven edge and centre fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Darlington",
          "https://api.postcodes.io/postcodes?lon=-1.553611&lat=54.523274&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=54.523274&lng=-1.553611&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E406&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E406&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Darlington"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Darlington%2C%20UK"
        ]
      }
    },
    {
      "id": "derby",
      "name": "Derby",
      "country": "England",
      "localAuthority": "Derby",
      "lat": 52.924693,
      "lon": -1.478054,
      "safety": {
        "violenceSexualIndicator": 4711,
        "asbIndicator": 1581,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 2,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 4711 violence/sexual-offence and 1581 ASB records in 12 months; relative composite places it in screening band 2/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 125000,
        "transactions": 532,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 73,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 59.5,
        "priorityScore": 42,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 532 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 606,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 214,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 65.5,
        "priorityScore": 42,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Derby LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 73 sale and 214 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 90,
        "londonChanges": 0,
        "birminghamMinutes": 35,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Derby: London 90 min (0 changes), Birmingham 35 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Ring roads, a major rail corridor, industry and proximity to East Midlands Airport increase transport-noise exposure."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Renewal and historic pockets coexist with traffic-dominated approaches and extensive industrial urban form."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Derby",
          "https://api.postcodes.io/postcodes?lon=-1.478054&lat=52.924693&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.924693&lng=-1.478054&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E418&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E418&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Derby"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Derby%2C%20UK"
        ]
      }
    },
    {
      "id": "doncaster",
      "name": "Doncaster",
      "country": "England",
      "localAuthority": "Doncaster",
      "lat": 53.522723,
      "lon": -1.132352,
      "safety": {
        "violenceSexualIndicator": 3126,
        "asbIndicator": 1193,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 3,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 3126 violence/sexual-offence and 1193 ASB records in 12 months; relative composite places it in screening band 3/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 108000,
        "transactions": 281,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 25,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 65.5,
        "priorityScore": 48,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 281 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 491,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 27,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 65.5,
        "priorityScore": 48,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Doncaster LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 25 sale and 27 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 100,
        "londonChanges": 0,
        "birminghamMinutes": 95,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Doncaster: London 100 min (0 changes), Birmingham 95 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Motorways, a nationally important railway and extensive logistics/industrial land create multiple persistent noise corridors."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "Civic assets and renewal are offset by extensive post-industrial, logistics and deprived urban fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Doncaster",
          "https://api.postcodes.io/postcodes?lon=-1.132352&lat=53.522723&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.522723&lng=-1.132352&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E430&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E430&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Doncaster"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.travelsouthyorkshire.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Doncaster%2C%20UK"
        ]
      }
    },
    {
      "id": "gateshead",
      "name": "Gateshead",
      "country": "England",
      "localAuthority": "Gateshead",
      "lat": 54.959914,
      "lon": -1.604945,
      "safety": {
        "violenceSexualIndicator": 3208,
        "asbIndicator": 2044,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 2,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 3208 violence/sexual-offence and 2044 ASB records in 12 months; relative composite places it in screening band 2/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 101000,
        "transactions": 597,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 32,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 64.5,
        "priorityScore": 51,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 597 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 587,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 27,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 58.5,
        "priorityScore": 45,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Gateshead LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 32 sale and 27 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 5,
        "confidence": "High",
        "reason": "Broad screen indicates a dense multimodal network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 180,
        "londonChanges": 0,
        "birminghamMinutes": 190,
        "birminghamChanges": 0,
        "score": 3,
        "confidence": "Low",
        "reason": "Approximate representative faster weekday journey from Newcastle used; short Metro connection from Gateshead: London 180 min (0 changes), Birmingham 190 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "The A1/A184, rail, river crossings and adjacency to Newcastle's urban core make noise exposure likely."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Strong riverside cultural assets and regeneration coexist with large traffic corridors and uneven post-industrial fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Gateshead",
          "https://api.postcodes.io/postcodes?lon=-1.604945&lat=54.959914&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=54.959914&lng=-1.604945&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E544&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E544&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Gateshead"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.nexus.org.uk/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Gateshead%2C%20UK"
        ]
      }
    },
    {
      "id": "gloucester",
      "name": "Gloucester",
      "country": "England",
      "localAuthority": "Gloucester",
      "lat": 51.86455,
      "lon": -2.246934,
      "safety": {
        "violenceSexualIndicator": 1819,
        "asbIndicator": 941,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 1819 violence/sexual-offence and 941 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 145000,
        "transactions": 681,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 74,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 65.5,
        "priorityScore": 48,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 681 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 743,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 65,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 65.5,
        "priorityScore": 48,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Gloucester LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 74 sale and 65 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 105,
        "londonChanges": 0,
        "birminghamMinutes": 55,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Gloucester: London 105 min (0 changes), Birmingham 55 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "M5 access, rail and industrial/port approaches create noise corridors, with calmer fabric beyond them."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Historic core and renewed docks support a favourable broad judgement, although arterial and edge areas are mixed."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Gloucester",
          "https://api.postcodes.io/postcodes?lon=-2.246934&lat=51.864550&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=51.864550&lng=-2.246934&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E556&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E556&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Gloucester"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Gloucester%2C%20UK"
        ]
      }
    },
    {
      "id": "halifax",
      "name": "Halifax",
      "country": "England",
      "localAuthority": "Calderdale",
      "lat": 53.722827,
      "lon": -1.860176,
      "safety": {
        "violenceSexualIndicator": 2608,
        "asbIndicator": 618,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2608 violence/sexual-offence and 618 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 127500,
        "transactions": 216,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 34,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 64.5,
        "priorityScore": 51,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 216 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 546,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 49,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 70.5,
        "priorityScore": 57,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Calderdale LA; underlying observation count is not published in the table and the LA is broader than the named town."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 34 sale and 49 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 180,
        "londonChanges": 1,
        "birminghamMinutes": 145,
        "birminghamChanges": 1,
        "score": 3,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Halifax: London 180 min (1 change), Birmingham 145 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Valley roads, rail and town-centre activity create concentrated noise, while the wider hilly urban area is mixed."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Outstanding civic and industrial architecture is tempered by deprivation and uneven upkeep in parts of the town."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Halifax",
          "https://api.postcodes.io/postcodes?lon=-1.860176&lat=53.722827&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.722827&lng=-1.860176&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E588&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E588&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Halifax"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.wymetro.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Halifax%2C%20UK"
        ]
      }
    },
    {
      "id": "hartlepool",
      "name": "Hartlepool",
      "country": "England",
      "localAuthority": "Hartlepool",
      "lat": 54.685388,
      "lon": -1.212911,
      "safety": {
        "violenceSexualIndicator": 2928,
        "asbIndicator": 1192,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 3,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2928 violence/sexual-offence and 1192 ASB records in 12 months; relative composite places it in screening band 3/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 83014,
        "transactions": 106,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 16,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 56.5,
        "priorityScore": 48,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 106 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 400,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 9,
        "marketScore": 1,
        "stockScore": 1,
        "screenScore": 55,
        "priorityScore": 48,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Hartlepool LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 16 sale and 9 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 195,
        "londonChanges": 1,
        "birminghamMinutes": 195,
        "birminghamChanges": 1,
        "score": 2,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Hartlepool: London 195 min (1 change), Birmingham 195 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Port industry, rail and arterial traffic are conspicuous, but overall urban intensity is moderate."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "The marina and heritage areas are positives, while deprivation and extensive industrial/post-industrial fabric reduce consistency."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Hartlepool",
          "https://api.postcodes.io/postcodes?lon=-1.212911&lat=54.685388&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=54.685388&lng=-1.212911&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E601&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E601&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Hartlepool"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Hartlepool%2C%20UK"
        ]
      }
    },
    {
      "id": "huddersfield",
      "name": "Huddersfield",
      "country": "England",
      "localAuthority": "Kirklees",
      "lat": 53.644281,
      "lon": -1.782201,
      "safety": {
        "violenceSexualIndicator": 2621,
        "asbIndicator": 498,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2621 violence/sexual-offence and 498 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 110000,
        "transactions": 288,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 33,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 70.5,
        "priorityScore": 57,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 288 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 582,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 91,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 67.5,
        "priorityScore": 51,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Kirklees LA; underlying observation count is not published in the table and the LA is broader than the named town."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 33 sale and 91 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 175,
        "londonChanges": 1,
        "birminghamMinutes": 135,
        "birminghamChanges": 1,
        "score": 3,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Huddersfield: London 175 min (1 change), Birmingham 135 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Ring-road traffic, rail and town-centre nightlife are evident, with lower-intensity residential areas beyond."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Strong stone architecture and landscape setting are balanced by traffic-heavy approaches and uneven central upkeep."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Huddersfield",
          "https://api.postcodes.io/postcodes?lon=-1.782201&lat=53.644281&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.644281&lng=-1.782201&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E664&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E664&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Huddersfield"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.wymetro.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Huddersfield%2C%20UK"
        ]
      }
    },
    {
      "id": "hull-kingston-upon-hull",
      "name": "Hull (Kingston upon Hull)",
      "country": "England",
      "localAuthority": "Kingston upon Hull, City of",
      "lat": 53.744587,
      "lon": -0.332576,
      "safety": {
        "violenceSexualIndicator": 2361,
        "asbIndicator": 405,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2361 violence/sexual-offence and 405 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 95000,
        "transactions": 406,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 92,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 70.5,
        "priorityScore": 54,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 406 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 498,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 128,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 70.5,
        "priorityScore": 54,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Kingston upon Hull, City of LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 92 sale and 128 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 165,
        "londonChanges": 0,
        "birminghamMinutes": 145,
        "birminghamChanges": 1,
        "score": 3,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Hull: London 165 min (0 changes), Birmingham 145 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Port, industry, freight traffic and broad arterial roads create substantial persistent-noise exposure."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Renewed old town and waterfront areas coexist with extensive deprived and industrial urban fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Kingston%20upon%20Hull",
          "https://api.postcodes.io/postcodes?lon=-0.332576&lat=53.744587&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.744587&lng=-0.332576&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E61244&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E61244&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Kingston%20upon%20Hull"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Hull%20%28Kingston%20upon%20Hull%29%2C%20UK"
        ]
      }
    },
    {
      "id": "ipswich",
      "name": "Ipswich",
      "country": "England",
      "localAuthority": "Ipswich",
      "lat": 52.057066,
      "lon": 1.152832,
      "safety": {
        "violenceSexualIndicator": 2451,
        "asbIndicator": 442,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2451 violence/sexual-offence and 442 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 137000,
        "transactions": 545,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 117,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 63.5,
        "priorityScore": 45,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 545 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 743,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 80,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 63.5,
        "priorityScore": 45,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Ipswich LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 117 sale and 80 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 65,
        "londonChanges": 0,
        "birminghamMinutes": 170,
        "birminghamChanges": 1,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Ipswich: London 65 min (0 changes), Birmingham 170 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "A14 approaches, rail and port activity create noise corridors, but the town's overall intensity is moderate."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Waterfront renewal and historic fabric are balanced by uneven centre, arterial and industrial areas."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Ipswich",
          "https://api.postcodes.io/postcodes?lon=1.152832&lat=52.057066&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.057066&lng=1.152832&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E689&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E689&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Ipswich"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Ipswich%2C%20UK"
        ]
      }
    },
    {
      "id": "kettering",
      "name": "Kettering",
      "country": "England",
      "localAuthority": "North Northamptonshire",
      "lat": 52.399947,
      "lon": -0.728307,
      "safety": {
        "violenceSexualIndicator": 1819,
        "asbIndicator": 1216,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 1819 violence/sexual-offence and 1216 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 129475,
        "transactions": 210,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 15,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 62.5,
        "priorityScore": 48,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 210 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 681,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 30,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 65.5,
        "priorityScore": 48,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for North Northamptonshire LA; underlying observation count is not published in the table and the LA is broader than the named town."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 15 sale and 30 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 55,
        "londonChanges": 0,
        "birminghamMinutes": 70,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Kettering: London 55 min (0 changes), Birmingham 70 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "A14 traffic and the Midland Main Line are conspicuous, while the smaller town scale allows calmer areas."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Historic pockets and ordinary maintained suburbs are balanced by traffic and commercial-edge fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Kettering",
          "https://api.postcodes.io/postcodes?lon=-0.728307&lat=52.399947&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.399947&lng=-0.728307&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E732&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E732&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Kettering"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Kettering%2C%20UK"
        ]
      }
    },
    {
      "id": "lancaster",
      "name": "Lancaster",
      "country": "England",
      "localAuthority": "Lancaster",
      "lat": 54.050069,
      "lon": -2.803161,
      "safety": {
        "violenceSexualIndicator": 1646,
        "asbIndicator": 1154,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 1646 violence/sexual-offence and 1154 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 130000,
        "transactions": 231,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 26,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 72.5,
        "priorityScore": 57,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 231 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 596,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 9,
        "marketScore": 1,
        "stockScore": 1,
        "screenScore": 68,
        "priorityScore": 57,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Lancaster LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 26 sale and 9 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 145,
        "londonChanges": 0,
        "birminghamMinutes": 110,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Lancaster: London 145 min (0 changes), Birmingham 110 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 4,
        "confidence": "Medium",
        "reason": "M6 and West Coast Main Line corridors are clear sources, but the compact historic city has substantial lower-intensity fabric."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Coherent historic architecture, river and nearby landscape support a favourable broad condition judgement."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Lancaster",
          "https://api.postcodes.io/postcodes?lon=-2.803161&lat=54.050069&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=54.050069&lng=-2.803161&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E769&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E769&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Lancaster"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Lancaster%2C%20UK"
        ]
      }
    },
    {
      "id": "leeds",
      "name": "Leeds",
      "country": "England",
      "localAuthority": "Leeds",
      "lat": 53.800703,
      "lon": -1.550264,
      "safety": {
        "violenceSexualIndicator": 5009,
        "asbIndicator": 1514,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 2,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 5009 violence/sexual-offence and 1514 ASB records in 12 months; relative composite places it in screening band 2/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 155000,
        "transactions": 2152,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 453,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 63.5,
        "priorityScore": 42,
        "confidenceComposite": 2.2857142857142856,
        "unknowns": 0,
        "affordabilityReason": "Median of 2152 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 779,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 627,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 63.5,
        "priorityScore": 42,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Leeds LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 453 sale and 627 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 5,
        "confidence": "High",
        "reason": "Broad screen indicates a dense multimodal network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 130,
        "londonChanges": 0,
        "birminghamMinutes": 115,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Leeds: London 130 min (0 changes), Birmingham 115 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Motorways, dense rail, arterial traffic, nightlife and airport influence make quietness inconsistent across the large city."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "A strong renewed centre, civic fabric and parks support pleasantness, though conditions vary considerably."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Leeds",
          "https://api.postcodes.io/postcodes?lon=-1.550264&lat=53.800703&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.800703&lng=-1.550264&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E787&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E787&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Leeds"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.wymetro.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Leeds%2C%20UK"
        ]
      }
    },
    {
      "id": "leicester",
      "name": "Leicester",
      "country": "England",
      "localAuthority": "Leicester",
      "lat": 52.633614,
      "lon": -1.133462,
      "safety": {
        "violenceSexualIndicator": 5784,
        "asbIndicator": 2366,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 1,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 5784 violence/sexual-offence and 2366 ASB records in 12 months; relative composite places it in screening band 1/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 130000,
        "transactions": 803,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 190,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 59.5,
        "priorityScore": 39,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 803 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 717,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 386,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 56.5,
        "priorityScore": 33,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Leicester LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 190 sale and 386 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 65,
        "londonChanges": 0,
        "birminghamMinutes": 55,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Leicester: London 65 min (0 changes), Birmingham 55 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Dense radial traffic, ring roads, rail and a large night-time economy create widespread urban noise pressure."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Historic and renewed central pockets coexist with traffic-heavy and uneven fabric, yielding a mixed judgement."
      },
      "seriousPriorityWeaknesses": 1,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Leicester",
          "https://api.postcodes.io/postcodes?lon=-1.133462&lat=52.633614&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.633614&lng=-1.133462&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E789&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E789&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Leicester"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Leicester%2C%20UK"
        ]
      }
    },
    {
      "id": "lincoln",
      "name": "Lincoln",
      "country": "England",
      "localAuthority": "Lincoln",
      "lat": 53.234841,
      "lon": -0.53844,
      "safety": {
        "violenceSexualIndicator": 2430,
        "asbIndicator": 1967,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 2,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2430 violence/sexual-offence and 1967 ASB records in 12 months; relative composite places it in screening band 2/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 118000,
        "transactions": 285,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 47,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 60.5,
        "priorityScore": 45,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 285 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 661,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 68,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 60.5,
        "priorityScore": 45,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Lincoln LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 47 sale and 68 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 120,
        "londonChanges": 0,
        "birminghamMinutes": 105,
        "birminghamChanges": 1,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Lincoln: London 120 min (0 changes), Birmingham 105 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "The A46, rail, tourism and student/nightlife activity create concentrated noise, with calmer areas elsewhere."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Cathedral-quarter heritage and a distinctive setting support a favourable judgement despite mixed lower-city approaches."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Lincoln",
          "https://api.postcodes.io/postcodes?lon=-0.538440&lat=53.234841&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.234841&lng=-0.538440&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E804&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E804&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Lincoln"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Lincoln%2C%20UK"
        ]
      }
    },
    {
      "id": "liverpool",
      "name": "Liverpool",
      "country": "England",
      "localAuthority": "Liverpool",
      "lat": 53.40935,
      "lon": -2.978495,
      "safety": {
        "violenceSexualIndicator": 6195,
        "asbIndicator": 1908,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 1,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 6195 violence/sexual-offence and 1908 ASB records in 12 months; relative composite places it in screening band 1/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 145000,
        "transactions": 2356,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 965,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 60.5,
        "priorityScore": 39,
        "confidenceComposite": 2.2857142857142856,
        "unknowns": 0,
        "affordabilityReason": "Median of 2356 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 683,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 347,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 66.5,
        "priorityScore": 45,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Liverpool LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 965 sale and 347 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 5,
        "confidence": "High",
        "reason": "Broad screen indicates a dense multimodal network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 135,
        "londonChanges": 0,
        "birminghamMinutes": 95,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Liverpool Lime Street: London 135 min (0 changes), Birmingham 95 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Port activity, dense road and rail infrastructure and a major nightlife economy create substantial noise pressure."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Exceptional civic and waterfront fabric plus renewal outweigh, but do not remove, marked variation and deprived areas."
      },
      "seriousPriorityWeaknesses": 1,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Liverpool",
          "https://api.postcodes.io/postcodes?lon=-2.978495&lat=53.409350&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.409350&lng=-2.978495&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E813&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E813&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Liverpool"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.merseytravel.gov.uk/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Liverpool%2C%20UK"
        ]
      }
    },
    {
      "id": "loughborough",
      "name": "Loughborough",
      "country": "England",
      "localAuthority": "Charnwood",
      "lat": 52.7721,
      "lon": -1.206164,
      "safety": {
        "violenceSexualIndicator": 1448,
        "asbIndicator": 703,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 5,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 1448 violence/sexual-offence and 703 ASB records in 12 months; relative composite places it in screening band 5/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 132000,
        "transactions": 206,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 17,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 65.5,
        "priorityScore": 51,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 206 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 677,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 20,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 65.5,
        "priorityScore": 51,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Charnwood LA; underlying observation count is not published in the table and the LA is broader than the named town."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 17 sale and 20 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 75,
        "londonChanges": 0,
        "birminghamMinutes": 75,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Loughborough: London 75 min (0 changes), Birmingham 75 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "M1 proximity, rail and university/nightlife activity create noise corridors but not continuous big-city intensity."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "A functional centre and greener university/residential fabric are balanced by ordinary industrial and arterial areas."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Loughborough",
          "https://api.postcodes.io/postcodes?lon=-1.206164&lat=52.772100&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.772100&lng=-1.206164&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E871&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E871&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Loughborough"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Loughborough%2C%20UK"
        ]
      }
    },
    {
      "id": "manchester",
      "name": "Manchester",
      "country": "England",
      "localAuthority": "Manchester",
      "lat": 53.47894,
      "lon": -2.245278,
      "safety": {
        "violenceSexualIndicator": null,
        "asbIndicator": null,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": null,
        "confidence": "Low",
        "reason": "Unknown: Greater Manchester Police crime data are unavailable on Police.uk; sparse point-query returns are cross-force records and cannot support a comparable indicator."
      },
      "buy": {
        "proxyMedian": 192500,
        "transactions": 4478,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 1372,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 67.6470588235294,
        "priorityScore": 45,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 1,
        "affordabilityReason": "Median of 4478 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 998,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 1456,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 67.6470588235294,
        "priorityScore": 45,
        "confidenceComposite": 2,
        "unknowns": 1,
        "affordabilityReason": "Official one-bedroom modelled average for Manchester LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 1372 sale and 1456 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 5,
        "confidence": "High",
        "reason": "Broad screen indicates a dense multimodal network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 125,
        "londonChanges": 0,
        "birminghamMinutes": 90,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Manchester Piccadilly: London 125 min (0 changes), Birmingham 90 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Dense road, tram and rail networks, major nightlife and airport-related activity make persistent quiet comparatively scarce."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Extensive renewal, civic architecture and active public realm support a favourable score despite pronounced spatial inequality."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Manchester",
          "https://api.postcodes.io/postcodes?lon=-2.245278&lat=53.478940&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.478940&lng=-2.245278&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/",
          "https://data.police.uk/changelog/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E904&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E904&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Manchester"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://tfgm.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Manchester%2C%20UK"
        ]
      }
    },
    {
      "id": "merthyr-tydfil",
      "name": "Merthyr Tydfil",
      "country": "Wales",
      "localAuthority": "Merthyr Tydfil",
      "lat": 51.745911,
      "lon": -3.378347,
      "safety": {
        "violenceSexualIndicator": 878,
        "asbIndicator": 417,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 5,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 878 violence/sexual-offence and 417 ASB records in 12 months; relative composite places it in screening band 5/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 66248,
        "transactions": 22,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Low",
        "oneBedCount": 3,
        "marketScore": 1,
        "stockScore": 1,
        "screenScore": 61,
        "priorityScore": 54,
        "confidenceComposite": 1.7142857142857142,
        "unknowns": 0,
        "affordabilityReason": "Median of 22 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 552,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 3,
        "marketScore": 1,
        "stockScore": 1,
        "screenScore": 61,
        "priorityScore": 54,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Merthyr Tydfil LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 3 sale and 3 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "High",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 205,
        "londonChanges": 1,
        "birminghamMinutes": 185,
        "birminghamChanges": 2,
        "score": 2,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Merthyr Tydfil: London 205 min (1 change), Birmingham 185 min (2 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "The A470, valley rail and industrial legacy create linear noise corridors, while surrounding low-density landscape moderates the town-wide picture."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "Dramatic landscape and heritage are offset by concentrated deprivation and uneven post-industrial town fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Merthyr%20Tydfil",
          "https://api.postcodes.io/postcodes?lon=-3.378347&lat=51.745911&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=51.745911&lng=-3.378347&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E931&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E931&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Merthyr%20Tydfil"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://tfw.wales/"
        ],
        "environment": [
          "https://datamap.gov.wales/layergroups/geonode%3AEnvironmental_Noise_Mapping_2022",
          "https://stats.gov.wales/en-GB/c67b9e08-dacc-439a-a244-2fce79b11400",
          "https://www.openstreetmap.org/search?query=Merthyr%20Tydfil%2C%20UK"
        ]
      }
    },
    {
      "id": "middlesbrough",
      "name": "Middlesbrough",
      "country": "England",
      "localAuthority": "Middlesbrough",
      "lat": 54.576431,
      "lon": -1.236825,
      "safety": {
        "violenceSexualIndicator": 3270,
        "asbIndicator": 1498,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 2,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 3270 violence/sexual-offence and 1498 ASB records in 12 months; relative composite places it in screening band 2/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 85000,
        "transactions": 183,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 14,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 55.5,
        "priorityScore": 45,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 183 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 499,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 50,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 58.5,
        "priorityScore": 45,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Middlesbrough LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 14 sale and 50 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 180,
        "londonChanges": 0,
        "birminghamMinutes": 175,
        "birminghamChanges": 0,
        "score": 3,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Middlesbrough: London 180 min (0 changes), Birmingham 175 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "A66 traffic, rail, port and heavy Teesside industry create conspicuous and persistent noise sources."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "Regeneration and civic assets are outweighed in the broad screen by deprived, industrial and traffic-dominated fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Middlesbrough",
          "https://api.postcodes.io/postcodes?lon=-1.236825&lat=54.576431&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=54.576431&lng=-1.236825&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E933&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E933&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Middlesbrough"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Middlesbrough%2C%20UK"
        ]
      }
    },
    {
      "id": "neath",
      "name": "Neath",
      "country": "Wales",
      "localAuthority": "Neath Port Talbot",
      "lat": 51.664226,
      "lon": -3.803389,
      "safety": {
        "violenceSexualIndicator": 1009,
        "asbIndicator": 319,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 5,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 1009 violence/sexual-offence and 319 ASB records in 12 months; relative composite places it in screening band 5/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 91250,
        "transactions": 42,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 3,
        "marketScore": 1,
        "stockScore": 1,
        "screenScore": 66,
        "priorityScore": 57,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Median of 42 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 498,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 3,
        "marketScore": 1,
        "stockScore": 1,
        "screenScore": 66,
        "priorityScore": 57,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Neath Port Talbot LA; underlying observation count is not published in the table and the LA is broader than the named town."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 3 sale and 3 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "High",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 150,
        "londonChanges": 0,
        "birminghamMinutes": 165,
        "birminghamChanges": 1,
        "score": 3,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Neath: London 150 min (0 changes), Birmingham 165 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "M4, rail and nearby industry create strong linear noise sources, but the smaller centre and valley setting moderate intensity."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Historic and landscape assets are balanced by traffic, industry and uneven post-industrial fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Neath",
          "https://api.postcodes.io/postcodes?lon=-3.803389&lat=51.664226&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=51.664226&lng=-3.803389&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E968&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E968&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Neath"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://tfw.wales/"
        ],
        "environment": [
          "https://datamap.gov.wales/layergroups/geonode%3AEnvironmental_Noise_Mapping_2022",
          "https://stats.gov.wales/en-GB/c67b9e08-dacc-439a-a244-2fce79b11400",
          "https://www.openstreetmap.org/search?query=Neath%2C%20UK"
        ]
      }
    },
    {
      "id": "newcastle-upon-tyne",
      "name": "Newcastle upon Tyne",
      "country": "England",
      "localAuthority": "Newcastle upon Tyne",
      "lat": 54.978011,
      "lon": -1.610189,
      "safety": {
        "violenceSexualIndicator": 3596,
        "asbIndicator": 2989,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 1,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 3596 violence/sexual-offence and 2989 ASB records in 12 months; relative composite places it in screening band 1/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 139950,
        "transactions": 1733,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 119,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 55.5,
        "priorityScore": 39,
        "confidenceComposite": 2.2857142857142856,
        "unknowns": 0,
        "affordabilityReason": "Median of 1733 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 810,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 124,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 55.5,
        "priorityScore": 39,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Newcastle upon Tyne LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 119 sale and 124 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 5,
        "confidence": "High",
        "reason": "Broad screen indicates a dense multimodal network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 170,
        "londonChanges": 0,
        "birminghamMinutes": 185,
        "birminghamChanges": 0,
        "score": 3,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Newcastle: London 170 min (0 changes), Birmingham 185 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "A1/A167 traffic, rail, metro and a major nightlife core make central quietness comparatively weak."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Strong historic streets, river setting and public realm support a favourable condition score despite uneven outer fabric."
      },
      "seriousPriorityWeaknesses": 1,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Newcastle%20upon%20Tyne",
          "https://api.postcodes.io/postcodes?lon=-1.610189&lat=54.978011&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=54.978011&lng=-1.610189&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E984&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E984&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Newcastle%20upon%20Tyne"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.nexus.org.uk/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Newcastle%20upon%20Tyne%2C%20UK"
        ]
      }
    },
    {
      "id": "newport",
      "name": "Newport",
      "country": "Wales",
      "localAuthority": "Newport",
      "lat": 51.587902,
      "lon": -2.996742,
      "safety": {
        "violenceSexualIndicator": 3122,
        "asbIndicator": 2020,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 2,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 3122 violence/sexual-offence and 2020 ASB records in 12 months; relative composite places it in screening band 2/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 128000,
        "transactions": 541,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 31,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 56.5,
        "priorityScore": 39,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 541 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 696,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 43,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 50.5,
        "priorityScore": 33,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Newport LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 31 sale and 43 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 100,
        "londonChanges": 0,
        "birminghamMinutes": 105,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Newport (South Wales): London 100 min (0 changes), Birmingham 105 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "M4, dense rail approaches, port industry and arterial traffic create multiple persistent noise corridors."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "Riverfront renewal and heritage pockets are offset by substantial deprived, traffic-heavy and post-industrial fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Casnewydd",
          "https://api.postcodes.io/postcodes?lon=-2.996742&lat=51.587902&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=51.587902&lng=-2.996742&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E991&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E991&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Newport"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://tfw.wales/"
        ],
        "environment": [
          "https://datamap.gov.wales/layergroups/geonode%3AEnvironmental_Noise_Mapping_2022",
          "https://stats.gov.wales/en-GB/c67b9e08-dacc-439a-a244-2fce79b11400",
          "https://www.openstreetmap.org/search?query=Newport%2C%20UK"
        ]
      }
    },
    {
      "id": "northampton",
      "name": "Northampton",
      "country": "England",
      "localAuthority": "West Northamptonshire",
      "lat": 52.237858,
      "lon": -0.895046,
      "safety": {
        "violenceSexualIndicator": 3637,
        "asbIndicator": 2665,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 1,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 3637 violence/sexual-offence and 2665 ASB records in 12 months; relative composite places it in screening band 1/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 150000,
        "transactions": 717,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 104,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 53.5,
        "priorityScore": 33,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 717 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 748,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 137,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 53.5,
        "priorityScore": 33,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for West Northamptonshire LA; underlying observation count is not published in the table and the LA is broader than the named town."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 104 sale and 137 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 60,
        "londonChanges": 0,
        "birminghamMinutes": 60,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Northampton: London 60 min (0 changes), Birmingham 60 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "M1/A45 traffic, a major rail corridor and extensive logistics activity create notable noise exposure."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Historic and maintained residential pockets are balanced by road-dominated growth and uneven central fabric."
      },
      "seriousPriorityWeaknesses": 1,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Northampton",
          "https://api.postcodes.io/postcodes?lon=-0.895046&lat=52.237858&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.237858&lng=-0.895046&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1014&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1014&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Northampton"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Northampton%2C%20UK"
        ]
      }
    },
    {
      "id": "norwich",
      "name": "Norwich",
      "country": "England",
      "localAuthority": "Norwich",
      "lat": 52.628869,
      "lon": 1.293307,
      "safety": {
        "violenceSexualIndicator": 3200,
        "asbIndicator": 1530,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 2,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 3200 violence/sexual-offence and 1530 ASB records in 12 months; relative composite places it in screening band 2/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 155000,
        "transactions": 1272,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 144,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 66.5,
        "priorityScore": 48,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 1272 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 781,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 112,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 66.5,
        "priorityScore": 48,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Norwich LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 144 sale and 112 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 110,
        "londonChanges": 0,
        "birminghamMinutes": 210,
        "birminghamChanges": 1,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Norwich: London 110 min (0 changes), Birmingham 210 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 4,
        "confidence": "Medium",
        "reason": "With no urban motorway, noise is concentrated on ring roads, rail and the nightlife core rather than dominating city-wide."
      },
      "condition": {
        "score": 5,
        "confidence": "Medium",
        "reason": "Exceptionally coherent historic fabric, waterways, parks and a generally attractive centre support the highest condition score."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Norwich",
          "https://api.postcodes.io/postcodes?lon=1.293307&lat=52.628869&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.628869&lng=1.293307&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1018&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1018&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Norwich"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Norwich%2C%20UK"
        ]
      }
    },
    {
      "id": "nottingham",
      "name": "Nottingham",
      "country": "England",
      "localAuthority": "Nottingham",
      "lat": 52.956196,
      "lon": -1.151204,
      "safety": {
        "violenceSexualIndicator": 5448,
        "asbIndicator": 3157,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 1,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 5448 violence/sexual-offence and 3157 ASB records in 12 months; relative composite places it in screening band 1/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 140000,
        "transactions": 1524,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 225,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 62.5,
        "priorityScore": 39,
        "confidenceComposite": 2.2857142857142856,
        "unknowns": 0,
        "affordabilityReason": "Median of 1524 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 734,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 509,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 62.5,
        "priorityScore": 39,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Nottingham LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 225 sale and 509 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 5,
        "confidence": "High",
        "reason": "Broad screen indicates a dense multimodal network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 100,
        "londonChanges": 0,
        "birminghamMinutes": 75,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Nottingham: London 100 min (0 changes), Birmingham 75 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Ring roads, rail, tram corridors and a major nightlife economy create substantial urban noise pressure."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Historic, civic and renewed central districts plus strong parks support a favourable score despite spatial variation."
      },
      "seriousPriorityWeaknesses": 1,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Nottingham",
          "https://api.postcodes.io/postcodes?lon=-1.151204&lat=52.956196&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.956196&lng=-1.151204&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1019&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1019&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Nottingham"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.transportnottingham.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Nottingham%2C%20UK"
        ]
      }
    },
    {
      "id": "peterborough",
      "name": "Peterborough",
      "country": "England",
      "localAuthority": "Peterborough",
      "lat": 52.572509,
      "lon": -0.242498,
      "safety": {
        "violenceSexualIndicator": 3013,
        "asbIndicator": 1510,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 2,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 3013 violence/sexual-offence and 1510 ASB records in 12 months; relative composite places it in screening band 2/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 129000,
        "transactions": 420,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 91,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 62.5,
        "priorityScore": 42,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 420 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 703,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 134,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 56.5,
        "priorityScore": 36,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Peterborough LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 91 sale and 134 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 50,
        "londonChanges": 0,
        "birminghamMinutes": 100,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Peterborough: London 50 min (0 changes), Birmingham 100 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "A1/A47 traffic, a very busy rail corridor and logistics/industrial land create multiple persistent noise sources."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Cathedral and riverside assets are balanced by traffic-dominated modern growth and uneven central/edge fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Peterborough",
          "https://api.postcodes.io/postcodes?lon=-0.242498&lat=52.572509&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.572509&lng=-0.242498&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1061&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1061&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Peterborough"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Peterborough%2C%20UK"
        ]
      }
    },
    {
      "id": "plymouth",
      "name": "Plymouth",
      "country": "England",
      "localAuthority": "Plymouth",
      "lat": 50.370015,
      "lon": -4.142068,
      "safety": {
        "violenceSexualIndicator": 4645,
        "asbIndicator": 2025,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 1,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 4645 violence/sexual-offence and 2025 ASB records in 12 months; relative composite places it in screening band 1/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 138500,
        "transactions": 1343,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 147,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 53.5,
        "priorityScore": 39,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 1343 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 703,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 124,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 53.5,
        "priorityScore": 39,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Plymouth LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 147 sale and 124 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 190,
        "londonChanges": 0,
        "birminghamMinutes": 205,
        "birminghamChanges": 0,
        "score": 2,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Plymouth: London 190 min (0 changes), Birmingham 205 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "A38, rail, naval/port activity and nightlife create noise corridors, while coastal topography provides lower-intensity areas."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Waterfront, parks and historic assets support a favourable judgement despite reconstructed and uneven inner fabric."
      },
      "seriousPriorityWeaknesses": 1,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Plymouth",
          "https://api.postcodes.io/postcodes?lon=-4.142068&lat=50.370015&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=50.370015&lng=-4.142068&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1073&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1073&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Plymouth"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Plymouth%2C%20UK"
        ]
      }
    },
    {
      "id": "portsmouth",
      "name": "Portsmouth",
      "country": "England",
      "localAuthority": "Portsmouth",
      "lat": 50.79685,
      "lon": -1.09117,
      "safety": {
        "violenceSexualIndicator": 4741,
        "asbIndicator": 1484,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 2,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 4741 violence/sexual-offence and 1484 ASB records in 12 months; relative composite places it in screening band 2/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 165000,
        "transactions": 541,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 177,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 57.5,
        "priorityScore": 39,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 541 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 900,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 176,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 57.5,
        "priorityScore": 39,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Portsmouth LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 177 sale and 176 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 95,
        "londonChanges": 0,
        "birminghamMinutes": 165,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Portsmouth & Southsea: London 95 min (0 changes), Birmingham 165 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Dense island roads, rail, ferry/naval port activity and nightlife make quietness relatively difficult at city scale."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Historic waterfront, seafront and coherent terraces support pleasantness, despite density and traffic pressure."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Portsmouth",
          "https://api.postcodes.io/postcodes?lon=-1.091170&lat=50.796850&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=50.796850&lng=-1.091170&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1089&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1089&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Portsmouth"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Portsmouth%2C%20UK"
        ]
      }
    },
    {
      "id": "preston",
      "name": "Preston",
      "country": "England",
      "localAuthority": "Preston",
      "lat": 53.760554,
      "lon": -2.698528,
      "safety": {
        "violenceSexualIndicator": 3087,
        "asbIndicator": 2352,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 2,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 3087 violence/sexual-offence and 2352 ASB records in 12 months; relative composite places it in screening band 2/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 104625,
        "transactions": 470,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 72,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 63.5,
        "priorityScore": 48,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 470 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 578,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 136,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 66.5,
        "priorityScore": 48,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Preston LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 72 sale and 136 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 130,
        "londonChanges": 0,
        "birminghamMinutes": 100,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Preston: London 130 min (0 changes), Birmingham 100 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "M6/M55 approaches, major rail, ring-road traffic and nightlife create substantial transport-noise exposure."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Civic and park assets are balanced by traffic-heavy approaches and uneven centre/industrial fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Preston",
          "https://api.postcodes.io/postcodes?lon=-2.698528&lat=53.760554&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.760554&lng=-2.698528&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1097&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1097&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Preston"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Preston%2C%20UK"
        ]
      }
    },
    {
      "id": "rotherham",
      "name": "Rotherham",
      "country": "England",
      "localAuthority": "Rotherham",
      "lat": 53.43072,
      "lon": -1.354738,
      "safety": {
        "violenceSexualIndicator": 1825,
        "asbIndicator": 846,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 1825 violence/sexual-offence and 846 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 111625,
        "transactions": 260,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 19,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 57.5,
        "priorityScore": 45,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 260 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 486,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 25,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 66.5,
        "priorityScore": 51,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Rotherham LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 19 sale and 25 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 145,
        "londonChanges": 1,
        "birminghamMinutes": 100,
        "birminghamChanges": 1,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Rotherham Central: London 145 min (1 change), Birmingham 100 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "M1/M18 approaches, rail, steel industry and freight corridors create conspicuous persistent noise sources."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "Renewal and heritage pockets are outweighed by extensive industrial, arterial and deprived urban fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Rotherham",
          "https://api.postcodes.io/postcodes?lon=-1.354738&lat=53.430720&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.430720&lng=-1.354738&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1145&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1145&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Rotherham"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.travelsouthyorkshire.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Rotherham%2C%20UK"
        ]
      }
    },
    {
      "id": "salford",
      "name": "Salford",
      "country": "England",
      "localAuthority": "Salford",
      "lat": 53.480643,
      "lon": -2.294998,
      "safety": {
        "violenceSexualIndicator": null,
        "asbIndicator": null,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": null,
        "confidence": "Low",
        "reason": "Unknown: Greater Manchester Police crime data are unavailable on Police.uk; sparse point-query returns are cross-force records and cannot support a comparable indicator."
      },
      "buy": {
        "proxyMedian": 190000,
        "transactions": 1850,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 513,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 64.11764705882354,
        "priorityScore": 41.25,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 1,
        "affordabilityReason": "Median of 1850 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 886,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 531,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 64.11764705882354,
        "priorityScore": 41.25,
        "confidenceComposite": 1.7142857142857142,
        "unknowns": 1,
        "affordabilityReason": "Official one-bedroom modelled average for Salford LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 513 sale and 531 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 5,
        "confidence": "High",
        "reason": "Broad screen indicates a dense multimodal network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 135,
        "londonChanges": 0,
        "birminghamMinutes": 95,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Low",
        "reason": "Approximate representative faster weekday journey from Manchester Piccadilly used; Salford origin is ambiguous: London 135 min (0 changes), Birmingham 95 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Motorways, rail, dense Manchester urban activity and nightlife/venue areas create widespread noise pressure."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Major waterfront regeneration coexists with traffic infrastructure, deprivation and highly uneven urban fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Salford",
          "https://api.postcodes.io/postcodes?lon=-2.294998&lat=53.480643&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.480643&lng=-2.294998&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/",
          "https://data.police.uk/changelog/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1164&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1164&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Salford"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://tfgm.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Salford%2C%20UK"
        ]
      }
    },
    {
      "id": "sheffield",
      "name": "Sheffield",
      "country": "England",
      "localAuthority": "Sheffield",
      "lat": 53.382508,
      "lon": -1.468536,
      "safety": {
        "violenceSexualIndicator": 4093,
        "asbIndicator": 2297,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 1,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 4093 violence/sexual-offence and 2297 ASB records in 12 months; relative composite places it in screening band 1/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 140000,
        "transactions": 1707,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 257,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 63.5,
        "priorityScore": 42,
        "confidenceComposite": 2.2857142857142856,
        "unknowns": 0,
        "affordabilityReason": "Median of 1707 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 689,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 401,
        "marketScore": 5,
        "stockScore": 4.5,
        "screenScore": 69.5,
        "priorityScore": 48,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Sheffield LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 257 sale and 401 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 5,
        "confidence": "High",
        "reason": "Broad screen indicates a dense multimodal network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 120,
        "londonChanges": 0,
        "birminghamMinutes": 75,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Sheffield: London 120 min (0 changes), Birmingham 75 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Arterial roads, rail, tram, industry and nightlife create busy corridors, but hills and extensive green space moderate the city-wide score."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Strong parks, stone neighbourhood fabric and renewed centre support a favourable judgement despite marked variation."
      },
      "seriousPriorityWeaknesses": 1,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Sheffield",
          "https://api.postcodes.io/postcodes?lon=-1.468536&lat=53.382508&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.382508&lng=-1.468536&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1195&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1195&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Sheffield"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.travelsouthyorkshire.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Sheffield%2C%20UK"
        ]
      }
    },
    {
      "id": "shrewsbury",
      "name": "Shrewsbury",
      "country": "England",
      "localAuthority": "Shropshire",
      "lat": 52.708167,
      "lon": -2.754329,
      "safety": {
        "violenceSexualIndicator": 1093,
        "asbIndicator": 356,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 5,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 1093 violence/sexual-offence and 356 ASB records in 12 months; relative composite places it in screening band 5/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 157500,
        "transactions": 309,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 33,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 69.5,
        "priorityScore": 54,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 309 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 605,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 33,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 75.5,
        "priorityScore": 60,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Shropshire LA; underlying observation count is not published in the table and the LA is broader than the named town."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 33 sale and 33 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 150,
        "londonChanges": 1,
        "birminghamMinutes": 60,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Shrewsbury: London 150 min (1 change), Birmingham 60 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Bypass roads and rail are clear sources, but the compact town and rural edge offer broadly lower urban intensity."
      },
      "condition": {
        "score": 5,
        "confidence": "Medium",
        "reason": "Exceptional historic fabric, river setting and coherent public realm support the highest broad condition score."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Shrewsbury",
          "https://api.postcodes.io/postcodes?lon=-2.754329&lat=52.708167&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.708167&lng=-2.754329&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1208&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1208&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Shrewsbury"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Shrewsbury%2C%20UK"
        ]
      }
    },
    {
      "id": "st-helens",
      "name": "St Helens",
      "country": "England",
      "localAuthority": "St. Helens",
      "lat": 53.455338,
      "lon": -2.738189,
      "safety": {
        "violenceSexualIndicator": 2022,
        "asbIndicator": 523,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2022 violence/sexual-offence and 523 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 94000,
        "transactions": 146,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 9,
        "marketScore": 1,
        "stockScore": 1,
        "screenScore": 59,
        "priorityScore": 48,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 146 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 590,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 24,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 54.5,
        "priorityScore": 42,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for St. Helens LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 9 sale and 24 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "High",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 145,
        "londonChanges": 1,
        "birminghamMinutes": 90,
        "birminghamChanges": 1,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from St Helens Central: London 145 min (1 change), Birmingham 90 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "M62 access, arterial roads, rail and industrial/logistics land create multiple noise corridors."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "Regeneration efforts are offset by extensive post-industrial, deprived and traffic-dominated fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=St%20Helens",
          "https://api.postcodes.io/postcodes?lon=-2.738189&lat=53.455338&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.455338&lng=-2.738189&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1250&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1250&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=St%20Helens"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.merseytravel.gov.uk/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=St%20Helens%2C%20UK"
        ]
      }
    },
    {
      "id": "stafford",
      "name": "Stafford",
      "country": "England",
      "localAuthority": "Stafford",
      "lat": 52.8058,
      "lon": -2.116656,
      "safety": {
        "violenceSexualIndicator": 1575,
        "asbIndicator": 693,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 5,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 1575 violence/sexual-offence and 693 ASB records in 12 months; relative composite places it in screening band 5/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 125000,
        "transactions": 203,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 20,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 71.5,
        "priorityScore": 57,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 203 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 629,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 20,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 71.5,
        "priorityScore": 57,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Stafford LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 20 sale and 20 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 75,
        "londonChanges": 0,
        "birminghamMinutes": 35,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Stafford: London 75 min (0 changes), Birmingham 35 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 4,
        "confidence": "Medium",
        "reason": "M6 and West Coast Main Line corridors are conspicuous, but the smaller town has substantial quieter fabric away from them."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Historic centre, waterways and generally maintained residential fabric support a favourable broad judgement."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Stafford",
          "https://api.postcodes.io/postcodes?lon=-2.116656&lat=52.805800&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.805800&lng=-2.116656&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1255&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1255&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Stafford"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Stafford%2C%20UK"
        ]
      }
    },
    {
      "id": "stockport",
      "name": "Stockport",
      "country": "England",
      "localAuthority": "Stockport",
      "lat": 53.408023,
      "lon": -2.158961,
      "safety": {
        "violenceSexualIndicator": null,
        "asbIndicator": null,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": null,
        "confidence": "Low",
        "reason": "Unknown: Greater Manchester Police crime data are unavailable on Police.uk; sparse point-query returns are cross-force records and cannot support a comparable indicator."
      },
      "buy": {
        "proxyMedian": 165000,
        "transactions": 830,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 41,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 57.05882352941177,
        "priorityScore": 41.25,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 1,
        "affordabilityReason": "Median of 830 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 807,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 89,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 60.588235294117645,
        "priorityScore": 41.25,
        "confidenceComposite": 2,
        "unknowns": 1,
        "affordabilityReason": "Official one-bedroom modelled average for Stockport LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 41 sale and 89 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 120,
        "londonChanges": 0,
        "birminghamMinutes": 75,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Stockport: London 120 min (0 changes), Birmingham 75 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "M60, A6, dense rail and Manchester Airport flight paths create significant transport-noise exposure."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "A strong historic market core, viaduct and generally attractive residential fabric support a favourable score despite traffic corridors."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Stockport",
          "https://api.postcodes.io/postcodes?lon=-2.158961&lat=53.408023&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.408023&lng=-2.158961&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/",
          "https://data.police.uk/changelog/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1268&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1268&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Stockport"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://tfgm.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Stockport%2C%20UK"
        ]
      }
    },
    {
      "id": "stockton-on-tees",
      "name": "Stockton-on-Tees",
      "country": "England",
      "localAuthority": "Stockton-on-Tees",
      "lat": 54.563971,
      "lon": -1.312668,
      "safety": {
        "violenceSexualIndicator": 2853,
        "asbIndicator": 1260,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 3,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2853 violence/sexual-offence and 1260 ASB records in 12 months; relative composite places it in screening band 3/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 78000,
        "transactions": 188,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 14,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 58.5,
        "priorityScore": 48,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Median of 188 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 537,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 36,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 61.5,
        "priorityScore": 48,
        "confidenceComposite": 1.7142857142857142,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Stockton-on-Tees LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 14 sale and 36 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 185,
        "londonChanges": 1,
        "birminghamMinutes": 180,
        "birminghamChanges": 1,
        "score": 3,
        "confidence": "Low",
        "reason": "Approximate representative faster weekday journey from Thornaby used for representative mainline journeys: London 185 min (1 change), Birmingham 180 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "A19/A66, rail and nearby Teesside industry create prominent and persistent noise sources."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "High-street and riverside renewal is balanced by industrial, deprived and uneven surrounding fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Stockton-on-Tees",
          "https://api.postcodes.io/postcodes?lon=-1.312668&lat=54.563971&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=54.563971&lng=-1.312668&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1270&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1270&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords="
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Stockton-on-Tees%2C%20UK"
        ]
      }
    },
    {
      "id": "stoke-on-trent",
      "name": "Stoke-on-Trent",
      "country": "England",
      "localAuthority": "Stoke-on-Trent",
      "lat": 53.022184,
      "lon": -2.173369,
      "safety": {
        "violenceSexualIndicator": 2370,
        "asbIndicator": 1510,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 3,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2370 violence/sexual-offence and 1510 ASB records in 12 months; relative composite places it in screening band 3/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 85000,
        "transactions": 346,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 26,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 65.5,
        "priorityScore": 48,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 346 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 515,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 53,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 65.5,
        "priorityScore": 48,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Stoke-on-Trent LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 26 sale and 53 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 85,
        "londonChanges": 0,
        "birminghamMinutes": 50,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Stoke-on-Trent: London 85 min (0 changes), Birmingham 50 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "A500/M6 access, rail and dispersed industrial land create widespread road and industrial noise corridors."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "Ceramic heritage and renewal pockets are offset by vacancy, deprivation and fragmented post-industrial urban fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Stoke-on-Trent",
          "https://api.postcodes.io/postcodes?lon=-2.173369&lat=53.022184&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.022184&lng=-2.173369&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1271&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1271&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords="
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Stoke-on-Trent%2C%20UK"
        ]
      }
    },
    {
      "id": "sunderland",
      "name": "Sunderland",
      "country": "England",
      "localAuthority": "Sunderland",
      "lat": 54.902165,
      "lon": -1.383803,
      "safety": {
        "violenceSexualIndicator": 2043,
        "asbIndicator": 1312,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 3,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2043 violence/sexual-offence and 1312 ASB records in 12 months; relative composite places it in screening band 3/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 79000,
        "transactions": 363,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 49,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 62.5,
        "priorityScore": 51,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 363 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 521,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 56,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 62.5,
        "priorityScore": 51,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Sunderland LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 49 sale and 56 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 195,
        "londonChanges": 0,
        "birminghamMinutes": 205,
        "birminghamChanges": 1,
        "score": 2,
        "confidence": "Low",
        "reason": "Approximate representative faster weekday journey from Sunderland; direct London service is limited: London 195 min (0 changes), Birmingham 205 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "A19 approaches, Metro/rail, port industry and nightlife create multiple urban noise sources."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Seafront and renewed riverside/civic areas are positives, while deprived and post-industrial fabric remains extensive."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Sunderland",
          "https://api.postcodes.io/postcodes?lon=-1.383803&lat=54.902165&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=54.902165&lng=-1.383803&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1295&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1295&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Sunderland"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.nexus.org.uk/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Sunderland%2C%20UK"
        ]
      }
    },
    {
      "id": "swansea",
      "name": "Swansea",
      "country": "Wales",
      "localAuthority": "Swansea",
      "lat": 51.62011,
      "lon": -3.941418,
      "safety": {
        "violenceSexualIndicator": 2514,
        "asbIndicator": 880,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 3,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2514 violence/sexual-offence and 880 ASB records in 12 months; relative composite places it in screening band 3/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 130000,
        "transactions": 455,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 25,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 64.5,
        "priorityScore": 51,
        "confidenceComposite": 2.2857142857142856,
        "unknowns": 0,
        "affordabilityReason": "Median of 455 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 684,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 16,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 61.5,
        "priorityScore": 51,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Swansea LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 25 sale and 16 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 170,
        "londonChanges": 0,
        "birminghamMinutes": 185,
        "birminghamChanges": 1,
        "score": 3,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Swansea: London 170 min (0 changes), Birmingham 185 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "M4/A483 approaches, rail, port and nightlife create corridors of noise, moderated by the coastal setting and lower-intensity areas."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Bay, parks and waterfront renewal support a favourable judgement despite uneven centre and post-industrial corridors."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Swansea",
          "https://api.postcodes.io/postcodes?lon=-3.941418&lat=51.620110&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=51.620110&lng=-3.941418&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1305&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1305&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Swansea"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://tfw.wales/"
        ],
        "environment": [
          "https://datamap.gov.wales/layergroups/geonode%3AEnvironmental_Noise_Mapping_2022",
          "https://stats.gov.wales/en-GB/c67b9e08-dacc-439a-a244-2fce79b11400",
          "https://www.openstreetmap.org/search?query=Swansea%2C%20UK"
        ]
      }
    },
    {
      "id": "swindon",
      "name": "Swindon",
      "country": "England",
      "localAuthority": "Swindon",
      "lat": 51.561532,
      "lon": -1.785458,
      "safety": {
        "violenceSexualIndicator": 2502,
        "asbIndicator": 1707,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 2,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2502 violence/sexual-offence and 1707 ASB records in 12 months; relative composite places it in screening band 2/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 148500,
        "transactions": 906,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 87,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 56.5,
        "priorityScore": 36,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 906 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 816,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 121,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 56.5,
        "priorityScore": 36,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Swindon LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 87 sale and 121 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 55,
        "londonChanges": 0,
        "birminghamMinutes": 95,
        "birminghamChanges": 1,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Swindon: London 55 min (0 changes), Birmingham 95 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "M4 access, a busy rail corridor and broad arterial roads create substantial transport-noise exposure."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Maintained residential and park areas are balanced by road-dominated modern form and uneven central fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Swindon",
          "https://api.postcodes.io/postcodes?lon=-1.785458&lat=51.561532&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=51.561532&lng=-1.785458&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1306&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1306&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Swindon"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Swindon%2C%20UK"
        ]
      }
    },
    {
      "id": "telford",
      "name": "Telford",
      "country": "England",
      "localAuthority": "Telford and Wrekin",
      "lat": 52.675404,
      "lon": -2.448752,
      "safety": {
        "violenceSexualIndicator": 1223,
        "asbIndicator": 438,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 5,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 1223 violence/sexual-offence and 438 ASB records in 12 months; relative composite places it in screening band 5/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 113500,
        "transactions": 180,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 31,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 66.5,
        "priorityScore": 51,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 180 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 600,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 22,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 63.5,
        "priorityScore": 51,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Telford and Wrekin LA; underlying observation count is not published in the table and the LA is broader than the named town."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 31 sale and 22 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "High",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 125,
        "londonChanges": 1,
        "birminghamMinutes": 40,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Telford Central: London 125 min (1 change), Birmingham 40 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "M54/A442 traffic and dispersed industrial estates create local noise, but low-density form reduces continuous urban intensity."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Green space and maintained newer districts are balanced by fragmented, car-oriented townscape and industrial edges."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Telford",
          "https://api.postcodes.io/postcodes?lon=-2.448752&lat=52.675404&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.675404&lng=-2.448752&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1323&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1323&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Telford"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.tfwm.org.uk/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Telford%2C%20UK"
        ]
      }
    },
    {
      "id": "torbay",
      "name": "Torbay",
      "country": "England",
      "localAuthority": "Torbay",
      "lat": 50.468826,
      "lon": -3.531407,
      "safety": {
        "violenceSexualIndicator": 2517,
        "asbIndicator": 940,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 3,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2517 violence/sexual-offence and 940 ASB records in 12 months; relative composite places it in screening band 3/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 148000,
        "transactions": 936,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 165,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 61.5,
        "priorityScore": 45,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 936 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 617,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 51,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 64.5,
        "priorityScore": 51,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Torbay LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 165 sale and 51 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 180,
        "londonChanges": 1,
        "birminghamMinutes": 195,
        "birminghamChanges": 1,
        "score": 3,
        "confidence": "Low",
        "reason": "Approximate representative faster weekday journey from Torquay used; some faster itineraries connect at Newton Abbot: London 180 min (1 change), Birmingham 195 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Seasonal visitor traffic, rail and resort nightlife create hotspots, but much of the coastal conurbation is lower-intensity."
      },
      "condition": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Coastal scenery, parks and resort heritage support a favourable score despite pockets of deprivation and uneven upkeep."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Torquay",
          "https://api.postcodes.io/postcodes?lon=-3.531407&lat=50.468826&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=50.468826&lng=-3.531407&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E61274&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E61274&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Torbay"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Torbay%2C%20UK"
        ]
      }
    },
    {
      "id": "wakefield",
      "name": "Wakefield",
      "country": "England",
      "localAuthority": "Wakefield",
      "lat": 53.683704,
      "lon": -1.498169,
      "safety": {
        "violenceSexualIndicator": 2844,
        "asbIndicator": 612,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2844 violence/sexual-offence and 612 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 116000,
        "transactions": 273,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 46,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 63.5,
        "priorityScore": 48,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 273 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 572,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 46,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 69.5,
        "priorityScore": 54,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Wakefield LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 46 sale and 46 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 120,
        "londonChanges": 0,
        "birminghamMinutes": 110,
        "birminghamChanges": 1,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Wakefield Westgate: London 120 min (0 changes), Birmingham 110 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "M1/M62 approaches, major rail and arterial traffic create multiple persistent noise corridors."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Historic and cultural assets are balanced by traffic infrastructure and uneven post-industrial urban fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Wakefield",
          "https://api.postcodes.io/postcodes?lon=-1.498169&lat=53.683704&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.683704&lng=-1.498169&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1386&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1386&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Wakefield"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.wymetro.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Wakefield%2C%20UK"
        ]
      }
    },
    {
      "id": "walsall",
      "name": "Walsall",
      "country": "England",
      "localAuthority": "Walsall",
      "lat": 52.586221,
      "lon": -1.980341,
      "safety": {
        "violenceSexualIndicator": 3067,
        "asbIndicator": 263,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 3067 violence/sexual-offence and 263 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 119975,
        "transactions": 404,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 36,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 62.5,
        "priorityScore": 45,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 404 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 648,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 44,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 62.5,
        "priorityScore": 45,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Walsall LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 36 sale and 44 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 115,
        "londonChanges": 1,
        "birminghamMinutes": 25,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Walsall: London 115 min (1 change), Birmingham 25 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "M6, dense arterial roads, rail and industrial land create widespread transport and industrial noise pressure."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "Civic and park pockets are outweighed by traffic-dominated, industrial and deprived urban fabric in the broad screen."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Walsall",
          "https://api.postcodes.io/postcodes?lon=-1.980341&lat=52.586221&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.586221&lng=-1.980341&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1392&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1392&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Walsall"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.tfwm.org.uk/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Walsall%2C%20UK"
        ]
      }
    },
    {
      "id": "warrington",
      "name": "Warrington",
      "country": "England",
      "localAuthority": "Warrington",
      "lat": 53.38957,
      "lon": -2.590897,
      "safety": {
        "violenceSexualIndicator": 2355,
        "asbIndicator": 452,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2355 violence/sexual-offence and 452 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 123250,
        "transactions": 498,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 56,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 65.5,
        "priorityScore": 48,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 498 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 670,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 40,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 65.5,
        "priorityScore": 48,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Warrington LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 56 sale and 40 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "Medium",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 105,
        "londonChanges": 0,
        "birminghamMinutes": 70,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Warrington Bank Quay: London 105 min (0 changes), Birmingham 70 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "M6/M62/M56, busy railways and extensive logistics/industry create unusually dense transport-noise corridors."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Waterways and maintained districts are balanced by logistics, road infrastructure and a mixed town centre."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Warrington",
          "https://api.postcodes.io/postcodes?lon=-2.590897&lat=53.389570&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.389570&lng=-2.590897&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1403&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1403&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Warrington"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Warrington%2C%20UK"
        ]
      }
    },
    {
      "id": "wigan",
      "name": "Wigan",
      "country": "England",
      "localAuthority": "Wigan",
      "lat": 53.545539,
      "lon": -2.629695,
      "safety": {
        "violenceSexualIndicator": null,
        "asbIndicator": null,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": null,
        "confidence": "Low",
        "reason": "Unknown: Greater Manchester Police crime data are unavailable on Police.uk; sparse point-query returns are cross-force records and cannot support a comparable indicator."
      },
      "buy": {
        "proxyMedian": 103750,
        "transactions": 200,
        "affordabilityScore": 5,
        "affordabilityConfidence": "High",
        "oneBedCount": 15,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 67.6470588235294,
        "priorityScore": 56.25,
        "confidenceComposite": 2,
        "unknowns": 1,
        "affordabilityReason": "Median of 200 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 541,
        "affordabilityScore": 5,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 23,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 67.6470588235294,
        "priorityScore": 56.25,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 1,
        "affordabilityReason": "Official one-bedroom modelled average for Wigan LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 15 sale and 23 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 120,
        "londonChanges": 0,
        "birminghamMinutes": 85,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Wigan North Western: London 120 min (0 changes), Birmingham 85 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "M6/M61 access, rail and arterial roads create clear corridors, but overall activity is below major-city intensity."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Renewal and historic pockets are balanced by post-industrial, traffic-heavy and uneven centre fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Wigan",
          "https://api.postcodes.io/postcodes?lon=-2.629695&lat=53.545539&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.545539&lng=-2.629695&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/",
          "https://data.police.uk/changelog/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1452&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1452&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Wigan"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://tfgm.com/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Wigan%2C%20UK"
        ]
      }
    },
    {
      "id": "wolverhampton",
      "name": "Wolverhampton",
      "country": "England",
      "localAuthority": "Wolverhampton",
      "lat": 52.586205,
      "lon": -2.129916,
      "safety": {
        "violenceSexualIndicator": 3338,
        "asbIndicator": 346,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 3338 violence/sexual-offence and 346 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 117500,
        "transactions": 462,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 51,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 62.5,
        "priorityScore": 45,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 462 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 671,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 94,
        "marketScore": 4,
        "stockScore": 3.5,
        "screenScore": 65.5,
        "priorityScore": 45,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Wolverhampton LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 51 sale and 94 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 4,
        "confidence": "High",
        "reason": "Broad screen indicates a useful town/city bus-and-rail network; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 105,
        "londonChanges": 0,
        "birminghamMinutes": 20,
        "birminghamChanges": 0,
        "score": 5,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Wolverhampton: London 105 min (0 changes), Birmingham 20 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 2,
        "confidence": "Medium",
        "reason": "Ring roads, rail/Metro, industry and nearby motorway corridors create substantial persistent noise pressure."
      },
      "condition": {
        "score": 2,
        "confidence": "Low",
        "reason": "Civic assets and renewal are offset by extensive deprived, traffic-dominated and post-industrial fabric."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Wolverhampton",
          "https://api.postcodes.io/postcodes?lon=-2.129916&lat=52.586205&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.586205&lng=-2.129916&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1476&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1476&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Wolverhampton"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://www.tfwm.org.uk/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Wolverhampton%2C%20UK"
        ]
      }
    },
    {
      "id": "worcester",
      "name": "Worcester",
      "country": "England",
      "localAuthority": "Worcester",
      "lat": 52.192932,
      "lon": -2.221088,
      "safety": {
        "violenceSexualIndicator": 2289,
        "asbIndicator": 935,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2289 violence/sexual-offence and 935 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 145500,
        "transactions": 466,
        "affordabilityScore": 1,
        "affordabilityConfidence": "High",
        "oneBedCount": 52,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 66.5,
        "priorityScore": 51,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Median of 466 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 709,
        "affordabilityScore": 1,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 52,
        "marketScore": 3,
        "stockScore": 2.5,
        "screenScore": 66.5,
        "priorityScore": 51,
        "confidenceComposite": 1.8571428571428572,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Worcester LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 52 sale and 52 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "Medium",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 125,
        "londonChanges": 0,
        "birminghamMinutes": 45,
        "birminghamChanges": 0,
        "score": 4,
        "confidence": "Low",
        "reason": "Approximate representative faster weekday journey from Worcester Foregate Street; city has multiple stations: London 125 min (0 changes), Birmingham 45 min (0 changes); recheck against the exact travel date."
      },
      "quiet": {
        "score": 4,
        "confidence": "Medium",
        "reason": "M5 and railways create defined corridors, but the small historic city has much lower-intensity fabric away from them."
      },
      "condition": {
        "score": 5,
        "confidence": "Medium",
        "reason": "Coherent historic centre, river setting and generally attractive urban fabric support the highest condition score."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Worcester",
          "https://api.postcodes.io/postcodes?lon=-2.221088&lat=52.192932&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=52.192932&lng=-2.221088&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1483&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1483&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Worcester"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/"
        ],
        "environment": [
          "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
          "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
          "https://www.openstreetmap.org/search?query=Worcester%2C%20UK"
        ]
      }
    },
    {
      "id": "wrexham",
      "name": "Wrexham",
      "country": "Wales",
      "localAuthority": "Wrexham",
      "lat": 53.047921,
      "lon": -2.994781,
      "safety": {
        "violenceSexualIndicator": 2095,
        "asbIndicator": 936,
        "geography": "data.police.uk street-crime records within 1 mile of Postcodes.io place centroid",
        "score": 4,
        "confidence": "Medium",
        "reason": "Identical-radius centre proxy: 2095 violence/sexual-offence and 936 ASB records in 12 months; relative composite places it in screening band 4/5, but this is not a population-normalised town or neighbourhood rate."
      },
      "buy": {
        "proxyMedian": 112500,
        "transactions": 186,
        "affordabilityScore": 3,
        "affordabilityConfidence": "High",
        "oneBedCount": 3,
        "marketScore": 1,
        "stockScore": 1,
        "screenScore": 59,
        "priorityScore": 48,
        "confidenceComposite": 2.142857142857143,
        "unknowns": 0,
        "affordabilityReason": "Median of 186 achieved standard flat/maisonette sales; this is an all-size flat screening proxy, not a one-bedroom estimate."
      },
      "rent": {
        "proxyMonthly": 594,
        "affordabilityScore": 3,
        "affordabilityConfidence": "Medium",
        "oneBedCount": 11,
        "marketScore": 2,
        "stockScore": 1.5,
        "screenScore": 60.5,
        "priorityScore": 48,
        "confidenceComposite": 2,
        "unknowns": 0,
        "affordabilityReason": "Official one-bedroom modelled average for Wrexham LA; underlying observation count is not published in the table."
      },
      "market": {
        "towerSignal": "Unclear",
        "reason": "Rightmove's filtered snapshot returned 3 sale and 11 rental results; these are portal headline counts, not deduplicated properties, and the query does not verify tower stock."
      },
      "localTransport": {
        "score": 3,
        "confidence": "High",
        "reason": "Broad screen indicates basic bus and rail coverage with less network depth; this is a town-level judgement, not a neighbourhood accessibility audit."
      },
      "nationalTransport": {
        "londonMinutes": 140,
        "londonChanges": 1,
        "birminghamMinutes": 75,
        "birminghamChanges": 1,
        "score": 4,
        "confidence": "Medium",
        "reason": "Approximate representative faster weekday journey from Wrexham General: London 140 min (1 change), Birmingham 75 min (1 change); recheck against the exact travel date."
      },
      "quiet": {
        "score": 3,
        "confidence": "Medium",
        "reason": "A483, rail and large industrial estates create noticeable corridors, while the town's scale limits continuous intensity."
      },
      "condition": {
        "score": 3,
        "confidence": "Low",
        "reason": "Historic and maintained pockets are balanced by industrial edges and a mixed, sometimes uneven centre."
      },
      "seriousPriorityWeaknesses": 0,
      "sources": {
        "crime": [
          "https://api.postcodes.io/places?q=Wrexham",
          "https://api.postcodes.io/postcodes?lon=-2.994781&lat=53.047921&limit=1&radius=2000",
          "https://data.police.uk/api/crimes-street/all-crime?lat=53.047921&lng=-2.994781&date=2026-07",
          "https://data.police.uk/docs/method/crime-street/"
        ],
        "buy": [
          "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
        ],
        "rent": [
          "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
          "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/august2026"
        ],
        "market": [
          "https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E1489&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=false&mustHave=&dontShow=retirement%2CsharedOwnership&furnishTypes=&keywords=",
          "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1489&minBedrooms=1&maxBedrooms=1&propertyTypes=flat&includeSSTC=true&mustHave=&dontShow=houseShare%2Cretirement&furnishTypes=&keywords=",
          "https://los.rightmove.co.uk/typeahead?query=Wrexham"
        ],
        "transport": [
          "https://www.nationalrail.co.uk/journey-planner/",
          "https://www.traveline.info/",
          "https://tfw.wales/"
        ],
        "environment": [
          "https://datamap.gov.wales/layergroups/geonode%3AEnvironmental_Noise_Mapping_2022",
          "https://stats.gov.wales/en-GB/c67b9e08-dacc-439a-a244-2fce79b11400",
          "https://www.openstreetmap.org/search?query=Wrexham%2C%20UK"
        ]
      }
    }
  ],
  "evidence": [
    {
      "id": "GC01",
      "workstream": "geography_crime",
      "title": "Places lookup",
      "publisher": "Postcodes.io",
      "url": "https://api.postcodes.io/places",
      "dataPeriod": "Current lookup",
      "retrievalDate": "2026-09-05",
      "geography": "Named place centroids",
      "coverage": "63 supplied locations",
      "limitations": "Place-name matching is not a statutory boundary lookup; Torbay uses Torquay as a practical centre and Welsh Newport was explicitly queried as Casnewydd."
    },
    {
      "id": "GC02",
      "workstream": "geography_crime",
      "title": "Nearest postcode lookup",
      "publisher": "Postcodes.io",
      "url": "https://api.postcodes.io/postcodes",
      "dataPeriod": "Current lookup",
      "retrievalDate": "2026-09-05",
      "geography": "Nearest postcode within 2 km of place centroid",
      "coverage": "63 supplied locations",
      "limitations": "Local authority code and police-force-area label describe the centroid postcode; they are not evidence about all parts of the settlement."
    },
    {
      "id": "GC03",
      "workstream": "geography_crime",
      "title": "Street-level crime API",
      "publisher": "Home Office / Police.uk",
      "url": "https://data.police.uk/api/crimes-street/all-crime",
      "dataPeriod": "2025-08 to 2026-07",
      "retrievalDate": "2026-09-05",
      "geography": "Fixed one-mile radius around each place centroid",
      "coverage": "696 town-month observations used in the final 58-location indicator; all categories were downloaded once per place-month and the two required categories counted locally",
      "limitations": "All locations except Bolton, Manchester, Salford, Stockport and Wigan"
    },
    {
      "id": "GC04",
      "workstream": "geography_crime",
      "title": "Street-level crime API method",
      "publisher": "Home Office / Police.uk",
      "url": "https://data.police.uk/docs/method/crime-street/",
      "dataPeriod": "Method current at retrieval",
      "retrievalDate": "2026-09-05",
      "geography": "Street-level anonymised crime points",
      "coverage": "Method documentation",
      "limitations": "Point results are anonymised and the one-mile centre circle is neither a settlement boundary nor population-normalised; centre footfall and density affect counts."
    },
    {
      "id": "GC05",
      "workstream": "geography_crime",
      "title": "Crime data last-updated endpoint",
      "publisher": "Home Office / Police.uk",
      "url": "https://data.police.uk/api/crime-last-updated",
      "dataPeriod": "Latest available month 2026-07",
      "retrievalDate": "2026-09-05",
      "geography": "England and Wales API",
      "coverage": "One metadata response",
      "limitations": "Confirms recency only; it does not establish complete coverage for every force."
    },
    {
      "id": "GC06",
      "workstream": "geography_crime",
      "title": "Police.uk changelog",
      "publisher": "Home Office / Police.uk",
      "url": "https://data.police.uk/changelog/",
      "dataPeriod": "Current at retrieval",
      "retrievalDate": "2026-09-05",
      "geography": "Force-level data availability",
      "coverage": "Greater Manchester Police coverage warning",
      "limitations": "Police.uk reports Greater Manchester Police crime data unavailable; sparse API point returns may be cross-force records and are not used as a safety indicator."
    },
    {
      "id": "AFF-BUY-PPD-2024-26",
      "workstream": "affordability",
      "title": "Price Paid Data yearly files (2024, 2025, 2026)",
      "publisher": "HM Land Registry",
      "url": "https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads",
      "dataPeriod": "Sales dated 2024-07-01 to 2026-06-30; downloaded from release updated 2026-08-28",
      "retrievalDate": "2026-09-05",
      "geography": "HMLR Town/City field; Torbay uses district field",
      "coverage": "All 63 locations; row-level counts are in affordability.json",
      "limitations": "All flat/maisonette sizes; no bedroom count. Standard category-A transactions only. Recent transactions may be incomplete because registration lags."
    },
    {
      "id": "AFF-RENT-PIPR-2026-07",
      "workstream": "affordability",
      "title": "Price Index of Private Rents, UK: monthly price statistics, 19 August 2026 edition",
      "publisher": "Office for National Statistics",
      "url": "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/priceindexofprivaterentsukmonthlypricestatistics",
      "dataPeriod": "2026-07",
      "retrievalDate": "2026-09-05",
      "geography": "Local authorities in England and Wales",
      "coverage": "All 63 locations mapped to 63 local-authority proxies; observation counts not published in table",
      "limitations": "Modelled mean for the entire private rental stock, not a median or new-let asking rent. Some local authorities are broader than named towns; latest months are provisional and lower-level estimates may be volatile."
    },
    {
      "id": "MT-RM-SEARCH-20260905",
      "workstream": "market_thickness",
      "title": "Rightmove one-bedroom flat search-result snapshots",
      "publisher": "Rightmove",
      "url": "https://www.rightmove.co.uk/property-for-sale.html | https://www.rightmove.co.uk/property-to-rent.html",
      "dataPeriod": "Snapshot 2026-09-05",
      "retrievalDate": "2026-09-05",
      "geography": "Rightmove town/city REGION identifiers, recorded per JSON row",
      "coverage": "126 headline result counts: separate sale and rent queries for all 63 locations",
      "limitations": "Live advertised-stock snapshot; portal-defined boundaries; counts may include duplicates and are not achieved transactions. No listing pages were opened or coded. Sale and rent exclusions differ as documented per row."
    },
    {
      "id": "MT-RM-LOS-20260905",
      "workstream": "market_thickness",
      "title": "Rightmove location typeahead resolver",
      "publisher": "Rightmove",
      "url": "https://los.rightmove.co.uk/typeahead",
      "dataPeriod": "Snapshot 2026-09-05",
      "retrievalDate": "2026-09-05",
      "geography": "Place-name resolution to Rightmove REGION identifiers",
      "coverage": "All 63 supplied location names; corrected aliases for Burton-on-Trent, Stoke-on-Trent, Stockton-on-Tees, Kingston upon Hull and St Helens",
      "limitations": "Portal geographies are proprietary and may not match administrative boundaries; Merthyr Tydfil and Neath resolver labels contain anomalous historic-county wording and are low-confidence."
    },
    {
      "id": "TR01",
      "workstream": "transport",
      "title": "National Rail journey planner",
      "publisher": "Rail Delivery Group",
      "url": "https://www.nationalrail.co.uk/journey-planner/",
      "dataPeriod": "Current timetable planner; representative weekday screen",
      "retrievalDate": "2026-09-05",
      "geography": "England and Wales rail network",
      "coverage": "All 63 locations",
      "limitations": "Journey duration varies by date/time and disruption; values are rounded screening snapshots, not guaranteed schedules."
    },
    {
      "id": "TR02",
      "workstream": "transport",
      "title": "Traveline journey planner",
      "publisher": "Traveline Information Ltd",
      "url": "https://www.traveline.info/",
      "dataPeriod": "Current public-transport information",
      "retrievalDate": "2026-09-05",
      "geography": "Great Britain",
      "coverage": "All 63 locations",
      "limitations": "Useful for broad mode/network availability; does not itself measure frequency quality in this screen."
    },
    {
      "id": "TR03",
      "workstream": "transport",
      "title": "Transport for West Midlands",
      "publisher": "West Midlands Combined Authority",
      "url": "https://www.tfwm.org.uk/",
      "dataPeriod": "Current network information",
      "retrievalDate": "2026-09-05",
      "geography": "West Midlands transport area",
      "coverage": "5 supplied locations",
      "limitations": "Regional source; Telford lies outside the core TfWM area and is supported mainly by Traveline."
    },
    {
      "id": "TR04",
      "workstream": "transport",
      "title": "Bee Network",
      "publisher": "Transport for Greater Manchester",
      "url": "https://tfgm.com/",
      "dataPeriod": "Current network information",
      "retrievalDate": "2026-09-05",
      "geography": "Greater Manchester",
      "coverage": "5 supplied locations",
      "limitations": "Town-level network evidence; exact stop accessibility varies by neighbourhood."
    },
    {
      "id": "TR05",
      "workstream": "transport",
      "title": "Metro",
      "publisher": "West Yorkshire Combined Authority",
      "url": "https://www.wymetro.com/",
      "dataPeriod": "Current network information",
      "retrievalDate": "2026-09-05",
      "geography": "West Yorkshire",
      "coverage": "5 supplied locations",
      "limitations": "Regional network source; exact frequency and walk access not audited."
    },
    {
      "id": "TR06",
      "workstream": "transport",
      "title": "Travel South Yorkshire",
      "publisher": "South Yorkshire Mayoral Combined Authority",
      "url": "https://www.travelsouthyorkshire.com/",
      "dataPeriod": "Current network information",
      "retrievalDate": "2026-09-05",
      "geography": "South Yorkshire",
      "coverage": "4 supplied locations",
      "limitations": "Regional network source; exact frequency and walk access not audited."
    },
    {
      "id": "TR07",
      "workstream": "transport",
      "title": "Nexus",
      "publisher": "Nexus",
      "url": "https://www.nexus.org.uk/",
      "dataPeriod": "Current network information",
      "retrievalDate": "2026-09-05",
      "geography": "Tyne and Wear",
      "coverage": "3 supplied locations",
      "limitations": "Gateshead national journeys use Newcastle as a practical gateway; transfer time is represented coarsely."
    },
    {
      "id": "TR08",
      "workstream": "transport",
      "title": "Merseytravel",
      "publisher": "Liverpool City Region Combined Authority",
      "url": "https://www.merseytravel.gov.uk/",
      "dataPeriod": "Current network information",
      "retrievalDate": "2026-09-05",
      "geography": "Liverpool City Region",
      "coverage": "2 supplied locations",
      "limitations": "Regional network source; exact neighbourhood access not audited."
    },
    {
      "id": "TR09",
      "workstream": "transport",
      "title": "Transport for Wales",
      "publisher": "Transport for Wales",
      "url": "https://tfw.wales/",
      "dataPeriod": "Current network information",
      "retrievalDate": "2026-09-05",
      "geography": "Wales and border rail network",
      "coverage": "6 supplied locations",
      "limitations": "Official operator/network source; journey times still vary by timetable and connection."
    },
    {
      "id": "TR10",
      "workstream": "transport",
      "title": "Transport Nottingham",
      "publisher": "Nottingham City Council",
      "url": "https://www.transportnottingham.com/",
      "dataPeriod": "Current network information",
      "retrievalDate": "2026-09-05",
      "geography": "Nottingham",
      "coverage": "1 supplied location",
      "limitations": "City-level source; does not establish accessibility for every neighbourhood."
    },
    {
      "id": "TR11",
      "workstream": "transport",
      "title": "Blackpool Transport",
      "publisher": "Blackpool Transport Services",
      "url": "https://www.blackpooltransport.com/",
      "dataPeriod": "Current network information",
      "retrievalDate": "2026-09-05",
      "geography": "Blackpool and Fylde Coast",
      "coverage": "1 supplied location",
      "limitations": "Operator source; service patterns and seasonal demand vary."
    },
    {
      "id": "ENV001",
      "workstream": "environment",
      "title": "Explaining the 2022 noise maps",
      "publisher": "Department for Environment, Food & Rural Affairs",
      "url": "https://www.gov.uk/government/publications/strategic-noise-mapping-2022/explaining-the-2022-noise-maps",
      "dataPeriod": "2022 mapping round; published 2024",
      "retrievalDate": "2026-09-05",
      "geography": "England: major roads, railways, airports and agglomerations",
      "coverage": "All 57 English candidate locations",
      "limitations": "Strategic mapping identifies modelled transport-noise exposure, not interior noise or every local source; used only as a broad screen."
    },
    {
      "id": "ENV002",
      "workstream": "environment",
      "title": "Environmental Noise Mapping 2022",
      "publisher": "Welsh Government / DataMapWales",
      "url": "https://datamap.gov.wales/layergroups/geonode%3AEnvironmental_Noise_Mapping_2022",
      "dataPeriod": "2022",
      "retrievalDate": "2026-09-05",
      "geography": "Wales: major roads, major railways and large urban areas",
      "coverage": "All 6 Welsh candidate locations",
      "limitations": "Modelled strategic layers omit fine street-level and building-insulation effects; used only as a broad screen."
    },
    {
      "id": "ENV003",
      "workstream": "environment",
      "title": "English indices of deprivation 2025",
      "publisher": "Ministry of Housing, Communities and Local Government",
      "url": "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025",
      "dataPeriod": "2025 release",
      "retrievalDate": "2026-09-05",
      "geography": "England LSOAs",
      "coverage": "All 57 English candidate locations",
      "limitations": "Deprivation is not a direct measure of appearance or upkeep and within-town variation is large; used cautiously as context for condition judgements."
    },
    {
      "id": "ENV004",
      "workstream": "environment",
      "title": "Welsh Index of Multiple Deprivation 2025",
      "publisher": "Welsh Government",
      "url": "https://stats.gov.wales/en-GB/c67b9e08-dacc-439a-a244-2fce79b11400",
      "dataPeriod": "2025",
      "retrievalDate": "2026-09-05",
      "geography": "Wales LSOAs",
      "coverage": "All 6 Welsh candidate locations",
      "limitations": "WIMD is not a direct visual-condition measure; physical environment has limited weight and within-town variation is large."
    },
    {
      "id": "ENV005",
      "workstream": "environment",
      "title": "OpenStreetMap current map",
      "publisher": "OpenStreetMap contributors / OpenStreetMap Foundation",
      "url": "https://www.openstreetmap.org/",
      "dataPeriod": "Live map at retrieval",
      "retrievalDate": "2026-09-05",
      "geography": "Candidate built-up areas",
      "coverage": "All 63 candidate locations",
      "limitations": "Map context supports identification of conspicuous roads, railways, airports, industrial land and broad urban form; it does not establish actual noise, dereliction or upkeep."
    }
  ]
};
