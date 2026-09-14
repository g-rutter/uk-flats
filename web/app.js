(() => {
  'use strict';
  const data = window.FLATS_DATA;
  if (!data || !Array.isArray(data.locations)) return;
  const MAP = { minLon: -6.4, maxLon: 2, minLat: 49.6, maxLat: 58.9, width: 560, height: 720 };
  const $ = id => document.getElementById(id);
  const byId = new Map(data.locations.map(x => [x.id, x]));
  const evidenceById = new Map(data.evidence.map(x => [x.id, x]));
  const crime = new Map();
  data.crimeResearch.forEach(x => { if (!crime.has(x.location_id)) crime.set(x.location_id, {}); crime.get(x.location_id)[x.category] = x; });
  const state = { tenure: 'buy', sort: 'score', sortDirection: 'desc', selectedId: data.locations[0]?.id, mapMeasure: 'composite', filters: [], nextFilterId: 1, locationSearch: '' };
  const escape = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const known = v => v !== null && v !== undefined && v !== '';
  const show = v => known(v) ? escape(v) : 'Not available';
  const oneDecimal = v => known(v) ? Number(v).toFixed(1) : 'Not available';
  const compactNumber = v => known(v) ? new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1 }).format(v) : 'Not available';
  const wholeNumber = v => known(v) ? new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(v) : 'Not available';
  const money = v => known(v) ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(v) : 'Not available';
  const minutes = (v, c) => known(v) ? `${v} min${known(c) ? ` · ${c} change${c === 1 ? '' : 's'}` : ''}` : 'Not available';
  const marketPrice = x => x[state.tenure][state.tenure === 'buy' ? 'proxyMedian' : 'proxyMonthly'];
  const stock = x => x[state.tenure].oneBedCount;
  const score = x => data.composite.results[x.id].tenures[state.tenure].score;
  const band = x => `score-${data.composite.results[x.id].tenures[state.tenure].band || 'unknown'}`;
  const forestGradient = ['#a45152', '#d3a13a', '#17624f'];
  const densitySmoothingMultiplier = 2 ** (-4 / 3); // Former smoothing level 1: the sharpest reviewed preset.
  const rate = (x, category) => crime.get(x.id)?.[category]?.rate_per_1000;
  const factor = (x, key) => data.composite.results[x.id].tenures[state.tenure].factors[key];
  const filterCriteria = {
    composite: { label: () => `${state.tenure === 'buy' ? 'Buying' : 'Renting'} composite score`, mapLabel: 'Composite score', value: score, format: compactNumber, mapFormat: value => `${show(value)} / 100` },
    housing_cost_score: { label: 'Housing-cost score', value: x => factor(x, 'housing_cost'), mapFormat: value => `${show(value)} / 5` },
    safety: { label: 'Recorded-offence score', value: x => factor(x, 'safety'), mapFormat: value => `${show(value)} / 5` },
    local_transport_score: { label: 'Local public-transport score', value: x => factor(x, 'local_transport'), mapFormat: value => `${show(value)} / 5` },
    residential_environment_score: { label: 'Residential-environment score', value: x => factor(x, 'residential_environment'), mapFormat: value => `${show(value)} / 5` },
    stock_score: { label: 'One-bedroom listings score', value: x => factor(x, 'stock'), mapFormat: value => `${show(value)} / 5` },
    national_transport: { label: 'National-transport score', value: x => factor(x, 'national_transport'), mapFormat: value => `${show(value)} / 5` },
    housing_cost: { label: () => state.tenure === 'buy' ? 'Median flat price (£)' : 'Typical one-bedroom rent (£/month)', mapLabel: () => state.tenure === 'buy' ? 'Median flat price' : 'Typical one-bedroom rent', value: marketPrice, format: money, mapFormat: value => `${money(value)}${state.tenure === 'rent' && known(value) ? ' per month' : ''}`, mapTickFormat: money, reverse: true },
    stock: { label: () => `${state.tenure === 'buy' ? 'For-sale' : 'Rental'} one-bedroom listings`, mapLabel: 'One-bedroom listings', value: stock, format: wholeNumber, mapFormat: value => known(value) ? `${wholeNumber(value)} listings` : 'Not available', mapTickFormat: wholeNumber },
    population: { label: 'Population (Census 2021)', mapLabel: 'Population', value: x => x.population.population, format: wholeNumber, mapFormat: value => known(value) ? `${wholeNumber(value)} residents` : 'Not available', mapTickFormat: wholeNumber },
    local_transport: { label: 'Public-transport connectivity', value: x => x.localTransport.pt_connectivity_0_100, mapFormat: value => `${oneDecimal(value)} / 100`, mapTickFormat: oneDecimal },
    local_transport_percentile: { label: 'Transport national percentile', value: x => x.localTransport.national_percentile },
    digital_connectivity: { label: 'Gigabit broadband availability (%)', mapLabel: 'Gigabit broadband availability', value: x => x.digitalConnectivity.gigabit_availability_pct, format: value => `${oneDecimal(value)}%`, mapFormat: value => `${oneDecimal(value)}% of residential premises`, mapTickFormat: value => `${oneDecimal(value)}%` },
    residential_environment: { label: 'Residential-environment index', value: x => x.residentialEnvironment.environment_index_0_100, mapFormat: value => `${oneDecimal(value)} / 100`, mapTickFormat: oneDecimal },
    residential_environment_percentile: { label: 'Environment national percentile', value: x => x.residentialEnvironment.national_percentile },
    air_burden: { label: 'Air-pollution burden', value: x => x.residentialEnvironment.air_burden, reverse: true },
    no2: { label: 'NO₂ concentration (µg/m³)', value: x => x.residentialEnvironment.no2_ug_m3, reverse: true },
    pm25: { label: 'PM₂.₅ concentration (µg/m³)', value: x => x.residentialEnvironment.pm25_ug_m3, reverse: true },
    pm10: { label: 'PM₁₀ concentration (µg/m³)', value: x => x.residentialEnvironment.pm10_ug_m3, reverse: true },
    noise: { label: 'Transport-noise exposure (%)', value: x => x.residentialEnvironment.noise_exposed_pct, reverse: true },
    green_access: { label: 'Residents within 300 m of green space (%)', value: x => x.residentialEnvironment.green_within_300m_pct },
    green_area: { label: 'Green space within 1,000 m (m²)', value: x => x.residentialEnvironment.green_area_within_1000m_m2 },
    epc: { label: 'Mean EPC SAP score', value: x => x.residentialEnvironment.epc_sap_mean },
    london: { label: 'London rail journey (minutes)', value: x => x.nationalTransport.londonMinutes, format: wholeNumber, reverse: true },
    london_changes: { label: 'London rail changes', value: x => x.nationalTransport.londonChanges, format: wholeNumber, reverse: true },
    birmingham: { label: 'Birmingham rail journey (minutes)', value: x => x.nationalTransport.birminghamMinutes, format: wholeNumber, reverse: true },
    birmingham_changes: { label: 'Birmingham rail changes', value: x => x.nationalTransport.birminghamChanges, format: wholeNumber, reverse: true },
    violence: { label: 'Violence against the person (/1,000)', value: x => rate(x, 'violence_against_person'), reverse: true },
    sexual: { label: 'Sexual offences (/1,000)', value: x => rate(x, 'sexual_offences'), reverse: true },
    transactions: { label: 'Completed flat sales in sample', value: x => x.buy.transactions, format: wholeNumber }
  };
  const criterionLabel = criterion => typeof criterion.label === 'function' ? criterion.label() : criterion.label;
  const metricGroups = [
    { label: 'Score components', keys: ['composite', 'housing_cost_score', 'safety', 'local_transport_score', 'residential_environment_score', 'stock_score', 'national_transport'] },
    { label: 'Other feeds', keys: ['population', 'housing_cost', 'stock', 'local_transport', 'local_transport_percentile', 'digital_connectivity', 'residential_environment', 'residential_environment_percentile', 'air_burden', 'no2', 'pm25', 'pm10', 'noise', 'green_access', 'green_area', 'epc', 'london', 'london_changes', 'birmingham', 'birmingham_changes', 'violence', 'sexual', 'transactions'] }
  ];
  const groupedOptions = selected => metricGroups.map(group => `<optgroup label="${escape(group.label)}">${group.keys.map(key => `<option value="${key}"${key === selected ? ' selected' : ''}>${escape(criterionLabel(filterCriteria[key]))}</option>`).join('')}</optgroup>`).join('');
  const mapMeasure = () => filterCriteria[state.mapMeasure];
  const mapMeasureLabel = () => {
    const label = mapMeasure().mapLabel || mapMeasure().label;
    return typeof label === 'function' ? label() : label;
  };
  const mapValue = x => mapMeasure().value(x);
  const mapDomain = () => { const values = data.locations.map(mapValue).filter(known).map(Number); return values.length ? [Math.min(...values), Math.max(...values)] : [null, null]; };
  const mapFormat = value => (mapMeasure().mapFormat || mapMeasure().format || compactNumber)(value);
  const mapTickFormat = value => (mapMeasure().mapTickFormat || mapMeasure().format || compactNumber)(value);
  const heatmapPosition = (value, domain) => {
    if (!known(value) || !known(domain[0])) return null;
    const position = domain[0] === domain[1] ? .5 : Math.max(0, Math.min(1, (Number(value) - domain[0]) / (domain[1] - domain[0])));
    return mapMeasure().reverse ? 1 - position : position;
  };
  const densityPaths = (locations, domain) => {
    const positions = locations.map(mapValue).filter(known).map(value => heatmapPosition(value, domain)).filter(known);
    if (!positions.length) return { fill: '', line: '', count: 0 };
    const mean = positions.reduce((total, position) => total + position, 0) / positions.length;
    const variance = positions.reduce((total, position) => total + (position - mean) ** 2, 0) / positions.length;
    const automaticBandwidth = 1.06 * Math.sqrt(variance) * positions.length ** -.2 || .07;
    const bandwidth = Math.max(.018, Math.min(.3, automaticBandwidth * densitySmoothingMultiplier));
    const baseline = 33, top = 2, samples = 80;
    const points = Array.from({ length: samples + 1 }, (_, index) => {
      const position = index / samples;
      const density = positions.reduce((total, observation) => total + Math.exp(-.5 * ((position - observation) / bandwidth) ** 2), 0);
      return { x: position * 100, density };
    });
    const peak = Math.max(...points.map(point => point.density));
    const line = points.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(2)} ${(baseline - (point.density / peak) * (baseline - top)).toFixed(2)}`).join(' ');
    return { fill: `${line} L100 ${baseline} L0 ${baseline} Z`, line, count: positions.length };
  };
  const criterionRange = criterion => {
    const values = data.locations.map(criterion.value).filter(known).map(Number);
    if (!values.length) return 'No values available';
    const format = criterion.format || compactNumber;
    return `Observed range: ${format(Math.min(...values))}–${format(Math.max(...values))}`;
  };
  const localTransportDefinition = 'DfT modelled public-transport opportunity to reach employment, services and social engagements. The settlement value is a Census-population-weighted mean of Output Area scores. It does not measure fares, crowding, cancellations, reliability, step-free access or travel from a particular home.';
  const digitalConnectivityDefinition = 'Ofcom provider-reported share of residential premises with gigabit-capable fixed-broadband availability in January 2025, aggregated across the reviewed built-up area. Availability is not observed or guaranteed speed, take-up, price, reliability, latency or in-home Wi-Fi performance. This field does not enter the composite score.';
  const environmentDefinition = 'Population-weighted residential surroundings across the reviewed built-up area: cleaner air, less modelled transport noise, access to eligible public green space and housing energy quality. It is not a street, building, safety, beauty or general deprivation measure.';
  const populationDefinition = 'Census 2021 usual residents in the reviewed April 2024 built-up area. This represents the continuously built-up settlement, not the wider local authority, and is a Census count rather than a current-year estimate.';
  const medianFlatPriceDefinition = 'Median completed flat and maisonette price for sales dated 1 July 2024 to 30 June 2026. It covers all flat sizes, not just one-bedroom flats; recent transactions can be incomplete because registration lags.';
  const project = x => [((x.lon - MAP.minLon) / (MAP.maxLon - MAP.minLon)) * MAP.width, MAP.height - ((x.lat - MAP.minLat) / (MAP.maxLat - MAP.minLat)) * MAP.height];
  const hexToRgb = hex => hex.match(/\w\w/g).map(value => parseInt(value, 16));
  const colourAt = (value, domain) => {
    if (!known(value) || !known(domain[0])) return null;
    const palettePosition = heatmapPosition(value, domain);
    const colours = forestGradient, scaled = palettePosition * (colours.length - 1), index = Math.min(colours.length - 2, Math.floor(scaled)), fraction = scaled - index;
    if (palettePosition === 0) return colours[0];
    if (palettePosition === 1) return colours[colours.length - 1];
    const start = hexToRgb(colours[index]), end = hexToRgb(colours[index + 1]);
    return `rgb(${start.map((channel, i) => Math.round(channel + (end[i] - channel) * fraction)).join(', ')})`;
  };
  const helpBody = content => typeof content === 'string' ? escape(content) :
    `<span>${escape(content.intro)}</span><span class="help-list" role="list">${content.items.map(item => `<span role="listitem">${escape(item)}</span>`).join('')}</span>`;
  const help = (label, content = '') => `${escape(label)}${content ? ` <span class="help-wrap"><button class="help" type="button" aria-expanded="false" aria-label="Show more information about ${escape(label)}">?</button><span class="help-text" hidden>${helpBody(content)}</span></span>` : ''}`;
  const row = (label, value, text = '') => `<dt>${help(label, text)}</dt><dd>${value}</dd>`;
  const section = (title, rows, scores = []) => {
    const grade = ([label, value]) => `<span class="section-score score-${known(value) ? Math.ceil(value) : 'unknown'}">${escape(label)} <b>${show(value)}</b></span>`;
    const scoreStrip = scores.length ? `<div class="section-scores" aria-label="Relative scores, each out of 5"><span class="relative-label">Relative score</span>${scores.map(grade).join('')}</div>` : '';
    return `<section class="detail-section"><div class="section-heading"><h3>${title}</h3>${scoreStrip}</div><dl>${rows.join('')}</dl></section>`;
  };
  const factors = {
    housing_cost: ['Housing cost', ''],
    safety: ['Recorded offences', 'Compares recorded rates for two offence types across broad CSP areas. Rates can be affected by reporting, recording practice, visitors and commuters, and area boundaries; they do not describe unreported crime, personal risk, or variation between streets and times.'],
    local_transport: ['Local public-transport connectivity', localTransportDefinition],
    residential_environment: ['Residential environment', environmentDefinition],
    stock: ['One-bedroom listings', 'Rightmove headline count at the recorded snapshot; listings are not deduplicated.'],
    national_transport: ['Rail connections', 'Representative journeys to London and Birmingham, including an allowance for changes.']
  };
  function housingCostHelp() {
    const bands = data.composite.housing_cost_bands[state.tenure];
    const knownCount = Object.values(bands).reduce((total, band) => total + band.count, 0);
    const suffix = state.tenure === 'rent' ? ' per month' : '';
    const range = band => band.minimum === band.maximum ? money(band.minimum) : `${money(band.minimum)}–${money(band.maximum)}`;
    return {
      intro: `Relative half-point bands across ${knownCount} current locations with known ${state.tenure === 'buy' ? 'sales prices' : 'one-bedroom rents'}; lower costs score higher.`,
      items: Object.entries(bands).map(([key, band]) => ({ score: Number(key), band })).sort((a, b) => b.score - a.score).filter(({ band }) => band.count).map(({ score, band }) => `Score ${score}: ${range(band)}${suffix} (${band.count} locations)`),
    };
  }

  function ordered(locations) {
    const compareValue = (a, b) => {
      const aKnown = known(a), bKnown = known(b);
      if (!aKnown || !bKnown) return aKnown === bKnown ? 0 : aKnown ? -1 : 1;
      return typeof a === 'string' ? a.localeCompare(b) : a - b;
    };
    const journey = (x, destination) => {
      const minutes = x.nationalTransport[`${destination}Minutes`];
      return known(minutes) ? [minutes, x.nationalTransport[`${destination}Changes`] ?? 0] : null;
    };
    const value = x => ({ name: x.name, score: score(x), price: marketPrice(x), stock: stock(x), london: journey(x, 'london'), birmingham: journey(x, 'birmingham'), violence: rate(x, 'violence_against_person'), sexual: rate(x, 'sexual_offences') }[state.sort]);
    return [...locations].sort((a, b) => {
      const aValue = value(a), bValue = value(b);
      const aKnown = Array.isArray(aValue) ? known(aValue[0]) : known(aValue);
      const bKnown = Array.isArray(bValue) ? known(bValue[0]) : known(bValue);
      if (aKnown !== bKnown) return aKnown ? -1 : 1;
      const result = Array.isArray(aValue) || Array.isArray(bValue)
        ? compareValue(aValue?.[0], bValue?.[0]) || compareValue(aValue?.[1], bValue?.[1])
        : compareValue(aValue, bValue);
      return result * (state.sortDirection === 'asc' ? 1 : -1) || a.name.localeCompare(b.name);
    });
  }
  function activeFilters() {
    return state.filters.filter(filter => filter.minimum !== '' || filter.maximum !== '');
  }
  function filteredLocations() {
    const filters = activeFilters();
    return data.locations.filter(location => filters.every(filter => {
      const value = filterCriteria[filter.criterion].value(location);
      if (!known(value)) return false;
      const number = Number(value);
      const minimum = filter.minimum === '' ? null : Number(filter.minimum);
      const maximum = filter.maximum === '' ? null : Number(filter.maximum);
      return (minimum === null || number >= minimum) && (maximum === null || number <= maximum);
    }));
  }
  function renderFilters() {
    $('filters').innerHTML = state.filters.map((filter, index) => `<div class="filter-row" data-filter-id="${filter.id}">
      <label class="criterion-field"><span>Criterion ${index + 1}</span><select aria-label="Criterion ${index + 1}">${groupedOptions(filter.criterion)}</select><small>${escape(criterionRange(filterCriteria[filter.criterion]))}</small></label>
      <label><span>At least</span><input class="filter-minimum" type="number" inputmode="decimal" step="any" value="${escape(filter.minimum)}" placeholder="No minimum" aria-label="Minimum ${escape(criterionLabel(filterCriteria[filter.criterion]))}"></label>
      <label><span>At most</span><input class="filter-maximum" type="number" inputmode="decimal" step="any" value="${escape(filter.maximum)}" placeholder="No maximum" aria-label="Maximum ${escape(criterionLabel(filterCriteria[filter.criterion]))}"></label>
      <button class="remove-filter" type="button" aria-label="Remove criterion ${index + 1}">Remove</button>
    </div>`).join('');
    $('clearFilters').hidden = state.filters.length === 0;
    $('filters').querySelectorAll('.filter-row').forEach(row => {
      const filter = state.filters.find(item => item.id === Number(row.dataset.filterId));
      row.querySelector('select').addEventListener('change', event => { filter.criterion = event.target.value; renderFilters(); renderView(); });
      row.querySelector('.filter-minimum').addEventListener('input', event => { filter.minimum = event.target.value; renderView(); });
      row.querySelector('.filter-maximum').addEventListener('input', event => { filter.maximum = event.target.value; renderView(); });
      row.querySelector('.remove-filter').addEventListener('click', () => { state.filters = state.filters.filter(item => item.id !== filter.id); renderFilters(); renderView(); });
    });
  }
  function tooltip(x, target) {
    const box = $('mapWrap').getBoundingClientRect(), marker = target.getBoundingClientRect();
    const value = mapValue(x);
    $('mapTooltip').innerHTML = `<strong>${escape(x.name)}</strong><span>${escape(mapMeasureLabel())}: ${mapFormat(value)}</span><span>${money(marketPrice(x))}${state.tenure === 'rent' ? ' per month' : ''} · ${show(stock(x))} one-bedroom listings</span>`;
    $('mapTooltip').style.left = `${marker.left - box.left + marker.width / 2}px`; $('mapTooltip').style.top = `${marker.top - box.top - 8}px`; $('mapTooltip').hidden = false;
  }
  function renderMap(locations) {
    const group = $('mapMarkers'); group.replaceChildren();
    const ids = new Set(locations.map(x => x.id)); if (!ids.has(state.selectedId)) state.selectedId = locations[0]?.id;
    const domain = mapDomain(), measure = mapMeasureLabel();
    let selectedLabel;
    locations.filter(x => known(x.lat) && known(x.lon)).forEach(x => {
      const [cx, cy] = project(x), marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      marker.setAttribute('cx', cx.toFixed(2)); marker.setAttribute('cy', cy.toFixed(2)); marker.setAttribute('r', x.id === state.selectedId ? '9' : '6');
      const value = mapValue(x);
      marker.setAttribute('class', `map-marker${!known(value) ? ' score-unknown' : ''}${x.id === state.selectedId ? ' selected' : ''}`); marker.setAttribute('fill', colourAt(value, domain) || 'var(--neutral)'); marker.setAttribute('tabindex', '0'); marker.setAttribute('role', 'button');
      marker.setAttribute('aria-label', `${x.name}: ${measure} ${mapFormat(value)}`);
      marker.addEventListener('mouseenter', () => tooltip(x, marker)); marker.addEventListener('mouseleave', () => { $('mapTooltip').hidden = true; });
      marker.addEventListener('focus', () => tooltip(x, marker)); marker.addEventListener('blur', () => { $('mapTooltip').hidden = true; });
      marker.addEventListener('click', () => select(x.id)); marker.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(x.id); } }); group.appendChild(marker);
      if (x.id === state.selectedId) { selectedLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text'); selectedLabel.setAttribute('x', (cx + 13).toFixed(2)); selectedLabel.setAttribute('y', (cy + 4).toFixed(2)); selectedLabel.setAttribute('class', 'selected-map-label'); selectedLabel.textContent = x.name; }
    });
    if (selectedLabel) group.appendChild(selectedLabel);
  }
  function sources(x) {
    const searches = data.sources.filter(s => s.location_id === x.id && isRightmoveSearch(s));
    const list = data.sources.filter(s => s.location_id === x.id && s.topic !== 'crime' && !isRightmoveSearch(s));
    const localEvidence = evidenceById.get(x.localTransport.evidence_id);
    if (localEvidence?.url && !list.some(source => source.url === localEvidence.url)) {
      list.push({ topic: 'localTransport', url: localEvidence.url });
    }
    const digitalEvidence = evidenceById.get(x.digitalConnectivity.evidence_id);
    if (digitalEvidence?.url && !list.some(source => source.url === digitalEvidence.url)) {
      list.push({ topic: 'digitalConnectivity', url: digitalEvidence.url });
    }
    const populationEvidence = evidenceById.get(x.population.evidence_id);
    if (populationEvidence?.url && !list.some(source => source.url === populationEvidence.url)) {
      list.push({ topic: 'population', url: populationEvidence.url });
    }
    const topic = value => ({ population: 'Population', buy: 'Buying', rent: 'Renting', market: 'Market', localTransport: 'Public-transport connectivity', digitalConnectivity: 'Digital connectivity', nationalTransport: 'Rail connections', environment: 'Residential environment' }[value] || value);
    const label = source => {
      const url = source.url;
      if (url.includes('price-paid-data-downloads')) return 'HM Land Registry price-paid data';
      if (url.includes('census2021-ts001')) return 'ONS Census 2021 usual-resident data';
      if (url.includes('priceindexofprivaterentsukmonthlypricestatistics')) return 'ONS private-rent statistics';
      if (url.includes('privaterentandhousepricesuk')) return 'ONS rent and house-price bulletin';
      if (url.includes('property-for-sale')) return 'Rightmove one-bedroom flats for sale';
      if (url.includes('property-to-rent')) return 'Rightmove one-bedroom flats to rent';
      if (url.includes('los.rightmove')) return 'Rightmove location lookup';
      if (url.includes('nationalrail.co.uk')) return 'National Rail journey planner';
      if (url.includes('transport-connectivity-metric')) return 'DfT transport connectivity metric';
      if (url.includes('connected-nations-update-spring-2025')) return 'Ofcom Connected Nations Spring 2025';
      if (url.includes('uk-air.defra.gov.uk')) return 'Defra modelled background pollution';
      if (url.includes('api.os.uk')) return 'OS Open Greenspace';
      if (url.includes('traveline.info')) return 'Traveline journey planner';
      if (url.includes('travelsouthyorkshire')) return 'Travel South Yorkshire network';
      if (url.includes('tfwm.org.uk')) return 'Transport for West Midlands network';
      if (url.includes('tfgm.com')) return 'Bee Network';
      if (url.includes('wymetro.com')) return 'West Yorkshire Metro';
      if (url.includes('nexus.org.uk')) return 'Nexus public transport';
      if (url.includes('merseytravel.gov.uk')) return 'Merseytravel network';
      if (url.includes('tfw.wales')) return 'Transport for Wales network';
      if (url.includes('transportnottingham.com')) return 'Transport Nottingham';
      if (url.includes('blackpooltransport.com')) return 'Blackpool Transport';
      if (url.includes('noise-mapping')) return 'Government guide to strategic noise maps';
      if (url.includes('indices-of-deprivation')) return 'English indices of deprivation';
      if (url.includes('stats.gov.wales')) return 'Welsh Index of Multiple Deprivation';
      if (url.includes('datamap.gov.wales')) return 'Welsh environmental noise map';
      if (url.includes('openstreetmap.org')) return 'OpenStreetMap location map';
      return new URL(url).hostname.replace(/^www\./, '');
    };
    const sale = searches.find(s => s.url.includes('/property-for-sale/'));
    const rent = searches.find(s => s.url.includes('/property-to-rent/'));
    const propertySearches = sale || rent ? `<section class="property-searches" aria-label="Rightmove property searches"><h3>Explore current listings</h3><p>Open the recorded one-bedroom flat searches for this location.</p><div class="property-search-links">${sale ? `<a class="property-search-link" href="${escape(sale.url)}" target="_blank" rel="noopener noreferrer">Buy on Rightmove <span aria-hidden="true">↗</span></a>` : ''}${rent ? `<a class="property-search-link" href="${escape(rent.url)}" target="_blank" rel="noopener noreferrer">Rent on Rightmove <span aria-hidden="true">↗</span></a>` : ''}</div></section>` : '';
    const sourceLinks = list.length ? `<details class="source-details"><summary>Source links</summary><ul class="source-links">${list.map(s => `<li><span>${escape(topic(s.topic))}</span> <a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(label(s))}</a></li>`).join('')}</ul></details>` : '';
    return propertySearches + sourceLinks;
  }
  function isRightmoveSearch(source) {
    return /^https:\/\/www\.rightmove\.co\.uk\/property-(for-sale|to-rent)\//.test(source.url);
  }
  function closeHelp() {
    $('details').querySelectorAll('.help-text').forEach(text => { text.hidden = true; });
    $('details').querySelectorAll('.help').forEach(button => button.setAttribute('aria-expanded', 'false'));
  }
  function renderDetail() {
    const x = byId.get(state.selectedId); if (!x) { $('details').innerHTML = '<p>No location matches the current view.</p>'; return; }
    const factorValues = data.composite.results[x.id].tenures[state.tenure].factors;
    const offences = crime.get(x.id), factorRows = Object.entries(factorValues).map(([key, value]) => {
      const [label, defaultNote] = factors[key] || [key, ''];
      const note = key === 'housing_cost' ? housingCostHelp() : defaultNote;
      return `<div class="component component-${escape(key)}"><span>${help(label, note)}</span><strong class="score-pill score-${known(value) ? Math.ceil(value) : 'unknown'}">${show(value)}</strong></div>`;
    }).join('');
    const priceRows = state.tenure === 'buy'
      ? [row('Median flat price', money(x.buy.proxyMedian), medianFlatPriceDefinition), row('Completed sales in sample', known(x.buy.transactions) ? `${show(x.buy.transactions)} sales` : 'Not available'), row('One-bedroom listings', known(x.buy.oneBedCount) ? `${show(x.buy.oneBedCount)} listings` : 'Not available', 'Rightmove headline count at the recorded snapshot; listings are not deduplicated.')]
      : [row('Typical one-bedroom rent', `${money(x.rent.proxyMonthly)}${known(x.rent.proxyMonthly) ? ' per month' : ''}`, 'Modelled monthly local-authority average; not an asking-rent median.'), row('One-bedroom listings', known(x.rent.oneBedCount) ? `${show(x.rent.oneBedCount)} listings` : 'Not available', 'Rightmove headline count at the recorded snapshot; listings are not deduplicated.')];
    const environment = x.residentialEnvironment;
    const digital = x.digitalConnectivity;
    const localRows = [
      row('Population', known(x.population.population) ? `${wholeNumber(x.population.population)} residents` : 'Not available', `${populationDefinition} Census date: 21 March 2021. Geography: ${show(x.population.geography_name)}.`),
      row('Public-transport connectivity', known(x.localTransport.pt_connectivity_0_100) ? `${oneDecimal(x.localTransport.pt_connectivity_0_100)} out of 100` : 'Not available', `${localTransportDefinition} Source period: ${show(x.localTransport.source_period)}.`),
      row('Transport national percentile', known(x.localTransport.national_percentile) ? `${oneDecimal(x.localTransport.national_percentile)} out of 100` : 'Not available', 'Compared with the Census-population-weighted distribution of all England and Wales Output Areas in the same DfT release; higher is better.'),
      row('Gigabit broadband availability', known(digital.gigabit_availability_pct) ? `${oneDecimal(digital.gigabit_availability_pct)}% of residential premises` : 'Not available', `${digitalConnectivityDefinition} Based on ${wholeNumber(digital.gigabit_available_premises)} of ${wholeNumber(digital.residential_premises)} residential premises; ${oneDecimal(known(digital.residential_premises) && digital.residential_premises ? 100 * digital.matched_residential_premises / digital.residential_premises : null)}% were matched to provider records. Source period: ${show(digital.source_period)}.`),
      row('Residential-environment index', known(environment.environment_index_0_100) ? `${oneDecimal(environment.environment_index_0_100)} out of 100` : 'Not available', environmentDefinition),
      row('Environment national percentile', known(environment.national_percentile) ? `${oneDecimal(environment.national_percentile)} out of 100` : 'Not available', 'Compared with the Census-population-weighted distribution of all April 2024 England and Wales built-up areas; higher is better.'),
      row('Air pollution', known(environment.air_burden) ? `Burden ${oneDecimal(environment.air_burden)} · NO₂ ${oneDecimal(environment.no2_ug_m3)}, PM₂.₅ ${oneDecimal(environment.pm25_ug_m3)}, PM₁₀ ${oneDecimal(environment.pm10_ug_m3)} µg/m³` : 'Not available', `Annual modelled outdoor concentrations. The burden equally averages each pollutant divided by its WHO 2021 annual guideline; lower is better. Source period: ${show(environment.air_period)}.`),
      row('Transport-noise exposure', known(environment.noise_exposed_pct) ? `${oneDecimal(environment.noise_exposed_pct)}% of residents` : 'Not available', `Modelled residents exposed at or above 55 dB Lden. England includes major-airport exposure while Wales covers road and rail; the score uses within-country percentiles. Source period: ${show(environment.quiet_period)}.`),
      row('Green space within 300 m', known(environment.green_within_300m_pct) ? `${oneDecimal(environment.green_within_300m_pct)}% of residents` : 'Not available', `Straight-line distance from OA population-weighted centroids to an OS public park, garden or playing field. Source period: ${show(environment.green_period)}.`),
      row('Green space within 1,000 m', known(environment.green_area_within_1000m_m2) ? `${wholeNumber(environment.green_area_within_1000m_m2)} m²` : 'Not available', `Population-weighted eligible polygon area inside a 1,000 m buffer; overlapping area is counted once. Source period: ${show(environment.green_period)}.`),
      row('Mean EPC SAP score', oneDecimal(environment.epc_sap_mean), `Modelled or imputed housing energy quality. England and Wales publish different transforms, so the score uses within-country percentiles. Source period: ${show(environment.housing_environment_period)}.`),
    ];
    $('details').innerHTML = `<p class="eyebrow">${escape(x.country)} · ${escape(x.localAuthority)}</p><h2>${escape(x.name)}</h2><div class="headline-grid"><div class="score-card ${band(x)}"><span>${state.tenure === 'buy' ? 'Buying' : 'Renting'} composite score</span><strong>${show(score(x))}<small>out of 100</small></strong></div><div><span>${state.tenure === 'buy' ? help('Median flat price', medianFlatPriceDefinition) : 'Typical one-bedroom rent'}</span><strong>${money(marketPrice(x))}${state.tenure === 'rent' ? '<small>per month</small>' : ''}</strong></div></div><section class="detail-section score-section"><div class="section-heading"><h3>Score components</h3><span>Each score is out of 5</span></div><div class="component-grid">${factorRows}</div></section>${section(state.tenure === 'buy' ? 'Buying evidence' : 'Renting evidence', priceRows, [['Price', factorValues.housing_cost], ['Listings', factorValues.stock]])}${section('Rail connections', [row('To London', minutes(x.nationalTransport.londonMinutes, x.nationalTransport.londonChanges)), row('To Birmingham', minutes(x.nationalTransport.birminghamMinutes, x.nationalTransport.birminghamChanges))], [['Rail', factorValues.national_transport]])}${section('Recorded offences', [row('Violence against the person', `${show(offences?.violence_against_person?.rate_per_1000)} per 1,000${offences?.violence_against_person ? ` · ${escape(offences.violence_against_person.csp_name)} CSP` : ''}`, 'Recorded rate for Apr 2025–Mar 2026.'), row('Sexual offences', `${show(offences?.sexual_offences?.rate_per_1000)} per 1,000${offences?.sexual_offences ? ` · ${escape(offences.sexual_offences.csp_name)} CSP` : ''}`, 'Recorded rate for Apr 2025–Mar 2026.')], [['Offences', factorValues.safety]])}${section('Local picture', localRows, [['Transport', factorValues.local_transport], ['Environment', factorValues.residential_environment]])}${sources(x)}`;
    $('details').querySelectorAll('.help').forEach(button => button.addEventListener('click', () => {
      const text = button.nextElementSibling, willOpen = text.hidden;
      closeHelp();
      text.hidden = !willOpen;
      button.setAttribute('aria-expanded', String(willOpen));
    }));
  }
  function renderTable(locations, searching = false) {
    const emptyMessage = searching ? 'No location names match this search.' : 'No locations meet every filter. Adjust a limit or clear the filters.';
    $('rows').innerHTML = locations.length ? locations.map(x => `<tr class="${x.id === state.selectedId ? 'is-selected' : ''}"><td><button data-id="${escape(x.id)}">${escape(x.name)}</button><small>${escape(x.localAuthority)} · ${escape(x.country)}</small></td><td><strong>${show(score(x))}</strong><small>out of 100</small></td><td>${money(marketPrice(x))}${state.tenure === 'buy' && known(x.buy.transactions) ? `<small>${x.buy.transactions} completed sales</small>` : ''}</td><td>${show(stock(x))}</td><td>${minutes(x.nationalTransport.londonMinutes, x.nationalTransport.londonChanges)}</td><td>${minutes(x.nationalTransport.birminghamMinutes, x.nationalTransport.birminghamChanges)}</td><td>${show(rate(x, 'violence_against_person'))}</td><td>${show(rate(x, 'sexual_offences'))}</td></tr>`).join('') : `<tr><td class="empty-results" colspan="8">${emptyMessage}</td></tr>`;
    $('rows').querySelectorAll('button').forEach(button => button.addEventListener('click', () => select(button.dataset.id, true)));
  }
  function renderSortHeadings() {
    const headings = { name: 'nameHeading', score: 'scoreHeading', price: 'priceHeading', stock: 'stockHeading', london: 'londonHeading', birmingham: 'birminghamHeading', violence: 'violenceHeading', sexual: 'sexualHeading' };
    const labels = { name: 'Location / local authority', score: 'Composite score out of 100', price: state.tenure === 'buy' ? 'Median flat price' : 'Typical one-bedroom rent / month', stock: 'One-bedroom listings', london: 'London rail', birmingham: 'Birmingham rail', violence: 'Violence / 1,000', sexual: 'Sexual offences / 1,000' };
    Object.entries(headings).forEach(([key, id]) => {
      const heading = $(id), active = state.sort === key, label = labels[key];
      heading.setAttribute('aria-sort', active ? (state.sortDirection === 'asc' ? 'ascending' : 'descending') : 'none');
      heading.innerHTML = `<button type="button" class="sort-button" data-sort="${key}" aria-label="Order this list by ${escape(label)}${active ? `, currently ${state.sortDirection === 'asc' ? 'ascending' : 'descending'}` : ''}">${escape(label)}${active ? `<span aria-hidden="true"> ${state.sortDirection === 'asc' ? '↑' : '↓'}</span>` : ''}</button>`;
    });
    document.querySelectorAll('.sort-button').forEach(button => button.addEventListener('click', () => {
      const key = button.dataset.sort;
      state.sortDirection = state.sort === key ? (state.sortDirection === 'asc' ? 'desc' : 'asc') : ({ name: 'asc', score: 'desc', price: 'asc', stock: 'desc', london: 'asc', birmingham: 'asc', violence: 'asc', sexual: 'asc' }[key]);
      state.sort = key; render();
    }));
  }
  function renderMapKey(locations) {
    // Browsers can restore a form control's prior value after reload. Keep the
    // displayed choice aligned with the freshly initialised application state.
    $('mapMeasure').value = state.mapMeasure;
    const [minimum, maximum] = mapDomain();
    const start = mapMeasure().reverse ? maximum : minimum;
    const end = mapMeasure().reverse ? minimum : maximum;
    [0, .25, .5, .75, 1].forEach((position, index) => {
      const value = known(start) && known(end) ? start + (end - start) * position : null;
      const tick = $(`mapKey${index}`);
      tick.textContent = known(value) ? mapTickFormat(value) : 'No values';
      tick.style.left = `${position * 100}%`;
    });
    $('mapGradient').style.background = `linear-gradient(90deg, ${forestGradient.join(', ')})`;
    const density = densityPaths(locations, [minimum, maximum]);
    $('mapDensityFill').setAttribute('d', density.fill);
    $('mapDensityLine').setAttribute('d', density.line);
    $('mapDensity').setAttribute('aria-label', density.count
      ? `${mapMeasureLabel()} distribution for ${density.count} visible ${density.count === 1 ? 'location' : 'locations'}`
      : `No visible locations have a ${mapMeasureLabel().toLowerCase()} value`);
    const valueMarks = $('mapValueMarks'); valueMarks.replaceChildren();
    const locationsAtValue = new Map();
    locations.forEach(location => {
      const value = mapValue(location);
      if (!known(value)) return;
      const key = String(value);
      if (!locationsAtValue.has(key)) locationsAtValue.set(key, { value, locations: [] });
      locationsAtValue.get(key).locations.push(location);
    });
    const heatmapWidth = $('mapGradient').getBoundingClientRect().width;
    const groupingDistance = heatmapWidth ? Math.min(.03, 8 / heatmapWidth) : .018;
    const valueGroups = [];
    [...locationsAtValue.values()].map(entry => ({ ...entry, position: heatmapPosition(entry.value, [minimum, maximum]) })).sort((a, b) => a.position - b.position).forEach(entry => {
      const group = valueGroups.at(-1);
      if (group && entry.position - group.startPosition <= groupingDistance) {
        group.entries.push(entry);
        group.position = group.entries.reduce((total, item) => total + item.position, 0) / group.entries.length;
      } else valueGroups.push({ startPosition: entry.position, position: entry.position, entries: [entry] });
    });
    let heatmapTooltipHideTimer;
    const hideHeatmapTooltip = () => {
      clearTimeout(heatmapTooltipHideTimer);
      heatmapTooltipHideTimer = setTimeout(() => { $('heatmapTooltip').hidden = true; }, 120);
    };
    const showHeatmapTooltip = (entries, position) => {
      clearTimeout(heatmapTooltipHideTimer);
      const tooltip = $('heatmapTooltip');
      const grouped = entries.length > 1;
      const locations = entries.flatMap(entry => entry.locations).sort((a, b) => a.name.localeCompare(b.name));
      const locationNames = locations.map(location => location.name);
      const title = grouped ? `${mapMeasureLabel()}: nearby values` : `${mapMeasureLabel()}: ${mapFormat(entries[0].value)}`;
      tooltip.innerHTML = `<strong>${escape(title)}</strong><ul>${locations.map(location => `<li><button type="button" data-location-id="${escape(location.id)}">${escape(location.name)}${grouped ? ` <small>(${escape(mapFormat(mapValue(location)))})</small>` : ''}</button></li>`).join('')}</ul>`;
      tooltip.style.left = `${position * 100}%`;
      tooltip.style.transform = position < .16 ? 'translateX(0)' : position > .84 ? 'translateX(-100%)' : 'translateX(-50%)';
      tooltip.hidden = false;
      tooltip.onmouseenter = () => clearTimeout(heatmapTooltipHideTimer);
      tooltip.onmouseleave = hideHeatmapTooltip;
      tooltip.querySelectorAll('[data-location-id]').forEach(button => button.addEventListener('click', () => {
        tooltip.hidden = true;
        select(button.dataset.locationId);
      }));
      return locationNames;
    };
    valueGroups.forEach(({ entries, position }) => {
      const mark = document.createElement('button');
      mark.type = 'button'; mark.className = 'heatmap-value-mark'; mark.style.left = `${position * 100}%`;
      const allLocations = entries.flatMap(entry => entry.locations).sort((a, b) => a.name.localeCompare(b.name));
      const label = entries.length > 1 ? 'nearby values' : mapFormat(entries[0].value);
      mark.setAttribute('aria-label', `${mapMeasureLabel()} ${label}: ${allLocations.map(location => location.name).join(', ')}`);
      const show = () => showHeatmapTooltip(entries, position);
      mark.addEventListener('mouseenter', show);
      mark.addEventListener('mouseleave', event => { if (!$('heatmapTooltip').contains(event.relatedTarget)) hideHeatmapTooltip(); });
      mark.addEventListener('focus', show);
      mark.addEventListener('blur', hideHeatmapTooltip);
      valueMarks.appendChild(mark);
    });
    const selected = byId.get(state.selectedId), selectedValue = selected && mapValue(selected);
    const selectedPosition = heatmapPosition(selectedValue, [minimum, maximum]);
    $('mapSelectionMark').style.left = `${(selectedPosition ?? 0) * 100}%`;
    $('mapSelectionMark').hidden = selectedPosition === null;
    const selectedEntry = known(selectedValue) ? locationsAtValue.get(String(selectedValue)) : null;
    if (selectedEntry) {
      const selectionMark = $('mapSelectionMark');
      const showSelected = () => showHeatmapTooltip([selectedEntry], selectedPosition);
      selectionMark.setAttribute('aria-label', `${selected.name}: ${mapFormat(selectedValue)}. Show locations at this value.`);
      selectionMark.onmouseenter = showSelected;
      selectionMark.onmouseleave = event => { if (!$('heatmapTooltip').contains(event.relatedTarget)) hideHeatmapTooltip(); };
      selectionMark.onfocus = showSelected;
      selectionMark.onblur = hideHeatmapTooltip;
      $('mapSelectionValue').onmouseenter = showSelected;
      $('mapSelectionValue').onmouseleave = hideHeatmapTooltip;
    }
    $('mapSelectionValue').textContent = selectedPosition === null ? '' : `${selected.name}: ${mapFormat(selectedValue)}`;
  }
  function renderView() {
    const locations = filteredLocations();
    const searchTerm = state.locationSearch.trim().toLocaleLowerCase('en-GB');
    const tableLocations = searchTerm ? locations.filter(location => location.name.toLocaleLowerCase('en-GB').includes(searchTerm)) : locations;
    if (!locations.some(location => location.id === state.selectedId)) state.selectedId = locations[0]?.id;
    const filterCount = activeFilters().length;
    const invalidIndex = state.filters.findIndex(filter => filter.minimum !== '' && filter.maximum !== '' && Number(filter.minimum) > Number(filter.maximum));
    $('filterNote').textContent = invalidIndex >= 0 ? `Criterion ${invalidIndex + 1} has a minimum above its maximum.` : state.filters.length ? 'Leave either limit blank for an open-ended range. Locations without a value are excluded when that criterion has a filled limit.' : 'No filters applied.';
    $('filters').querySelectorAll('.filter-row').forEach((row, index) => {
      const invalid = index === invalidIndex;
      row.classList.toggle('is-invalid', invalid);
      row.querySelectorAll('input').forEach(input => input.setAttribute('aria-invalid', String(invalid)));
    });
    $('count').textContent = `${locations.length} ${locations.length === 1 ? 'location' : 'locations'} shown on the map`;
    $('resultSummary').textContent = searchTerm
      ? `Showing ${tableLocations.length} matching ${tableLocations.length === 1 ? 'location' : 'locations'} from ${locations.length}${filterCount ? ' refined' : ''}`
      : filterCount ? `Showing ${locations.length} of ${data.locations.length} · ${filterCount} ${filterCount === 1 ? 'criterion' : 'criteria'}` : `Showing all ${locations.length}`;
    renderMapKey(locations); renderMap(locations); renderDetail(); renderTable(ordered(tableLocations), Boolean(searchTerm)); renderSortHeadings();
  }
  function render() { $('mapMeasure').innerHTML = groupedOptions(state.mapMeasure); renderFilters(); renderView(); }
  function select(id, scroll = false) { state.selectedId = id; renderView(); if (scroll && matchMedia('(max-width: 920px)').matches) $('details').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  function setTenure(tenure) { state.tenure = tenure; $('buyToggle').setAttribute('aria-pressed', tenure === 'buy'); $('rentToggle').setAttribute('aria-pressed', tenure === 'rent'); render(); }
  $('buyToggle').addEventListener('click', () => setTenure('buy')); $('rentToggle').addEventListener('click', () => setTenure('rent'));
  $('addFilter').addEventListener('click', () => {
    const filter = { id: state.nextFilterId++, criterion: 'composite', minimum: '', maximum: '' };
    state.filters.push(filter); renderFilters();
    $('filters').querySelector(`[data-filter-id="${filter.id}"] select`).focus();
  });
  $('clearFilters').addEventListener('click', () => { state.filters = []; render(); $('addFilter').focus(); });
  $('mapMeasure').addEventListener('input', event => { state.mapMeasure = event.target.value; renderView(); });
  $('locationSearch').addEventListener('input', event => { state.locationSearch = event.target.value; renderView(); });
  document.addEventListener('click', event => { if (!event.target.closest('.help-wrap')) closeHelp(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeHelp(); });
  $('evidence').innerHTML = data.evidence.filter(x => x.workstream !== 'geography_crime' || x.id === 'CRIME-ONS-2026-CSP').map(x => `<h3>${escape(x.title)}</h3><p>${escape(x.dataPeriod)} · Recorded retrieval: ${escape(x.retrievalDate)} · ${escape(x.geography)}</p><p>${escape(x.limitations)}</p>`).join('');
  render();
})();
