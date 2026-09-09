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
  const state = { tenure: 'buy', locationId: '', country: 'all', sort: 'score', sortDirection: 'desc', selectedId: data.locations[0]?.id };
  const escape = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const known = v => v !== null && v !== undefined && v !== '';
  const show = v => known(v) ? escape(v) : 'Not available';
  const oneDecimal = v => known(v) ? Number(v).toFixed(1) : 'Not available';
  const money = v => known(v) ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(v) : 'Not available';
  const minutes = (v, c) => known(v) ? `${v} min${known(c) ? ` · ${c} change${c === 1 ? '' : 's'}` : ''}` : 'Not available';
  const assessment = (topic, value) => ({
    quiet: { persistent_noise: 'Persistent noise exposure', mixed_exposure: 'Mixed exposure', lower_intensity: 'Lower-intensity exposure' },
    condition: { highest: 'Highest broad condition', favourable: 'Favourable broad condition', mixed: 'Mixed broad condition' }
  }[topic]?.[value] || 'Not available');
  const price = x => x[state.tenure][state.tenure === 'buy' ? 'proxyMedian' : 'proxyMonthly'];
  const stock = x => x[state.tenure].oneBedCount;
  const score = x => data.composite.results[x.id].tenures[state.tenure].score;
  const band = x => `score-${data.composite.results[x.id].tenures[state.tenure].band || 'unknown'}`;
  const rate = (x, category) => crime.get(x.id)?.[category]?.rate_per_1000;
  const localTransportDefinition = 'DfT modelled public-transport opportunity to reach employment, services and social engagements. The settlement value is a Census-population-weighted mean of Output Area scores. It does not measure fares, crowding, cancellations, reliability, step-free access or travel from a particular home.';
  const recentSalesDefinition = '“Recent” means completed flat and maisonette sales dated 1 July 2024 to 30 June 2026. The figure is the median across all flat sizes, not a one-bedroom estimate; recent transactions can be incomplete because registration lags.';
  const project = x => [((x.lon - MAP.minLon) / (MAP.maxLon - MAP.minLon)) * MAP.width, MAP.height - ((x.lat - MAP.minLat) / (MAP.maxLat - MAP.minLat)) * MAP.height];
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
    condition: ['Local condition', 'Broad assessment of the town or city’s physical condition.'],
    quiet: ['Quietness', 'Broad assessment of likely noise exposure across the town or city.'],
    stock: ['One-bedroom listings', 'Rightmove headline count at the recorded snapshot; listings are not deduplicated.'],
    national_transport: ['Rail connections', 'Representative journeys to London and Birmingham, including an allowance for changes.']
  };
  function housingCostHelp() {
    const bands = data.composite.housing_cost_bands[state.tenure];
    const knownCount = Object.values(bands).reduce((total, band) => total + band.count, 0);
    const suffix = state.tenure === 'rent' ? ' per month' : '';
    const range = band => band.minimum === band.maximum ? money(band.minimum) : `${money(band.minimum)}–${money(band.maximum)}`;
    return {
      intro: `Relative quintiles across ${knownCount} current locations with known ${state.tenure === 'buy' ? 'sales prices' : 'one-bedroom rents'}; lower costs score higher.`,
      items: [5, 4, 3, 2, 1].filter(score => bands[score].count).map(score => `Score ${score}: ${range(bands[score])}${suffix} (${bands[score].count} locations)`),
    };
  }

  function filtered() { return data.locations.filter(x => (!state.locationId || x.id === state.locationId) && (state.country === 'all' || x.country === state.country)); }
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
    const value = x => ({ name: x.name, score: score(x), price: price(x), stock: stock(x), london: journey(x, 'london'), birmingham: journey(x, 'birmingham'), violence: rate(x, 'violence_against_person'), sexual: rate(x, 'sexual_offences') }[state.sort]);
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
  function populateLocations() {
    data.locations.slice().sort((a, b) => a.name.localeCompare(b.name)).forEach(x => {
      const option = document.createElement('option'); option.value = x.id; option.textContent = `${x.name} — ${x.localAuthority}`; $('locationSelect').appendChild(option);
    });
  }
  function tooltip(x, target) {
    const box = $('mapWrap').getBoundingClientRect(), marker = target.getBoundingClientRect();
    $('mapTooltip').innerHTML = `<strong>${escape(x.name)}</strong><span>Composite score: ${show(score(x))} out of 100</span><span>${money(price(x))}${state.tenure === 'rent' ? ' per month' : ''} · ${show(stock(x))} one-bedroom listings</span>`;
    $('mapTooltip').style.left = `${marker.left - box.left + marker.width / 2}px`; $('mapTooltip').style.top = `${marker.top - box.top - 8}px`; $('mapTooltip').hidden = false;
  }
  function renderMap(locations) {
    const group = $('mapMarkers'); group.replaceChildren();
    const ids = new Set(locations.map(x => x.id)); if (!ids.has(state.selectedId)) state.selectedId = locations[0]?.id;
    let selectedLabel;
    locations.filter(x => known(x.lat) && known(x.lon)).forEach(x => {
      const [cx, cy] = project(x), marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      marker.setAttribute('cx', cx.toFixed(2)); marker.setAttribute('cy', cy.toFixed(2)); marker.setAttribute('r', x.id === state.selectedId ? '9' : '6');
      marker.setAttribute('class', `map-marker ${band(x)}${x.id === state.selectedId ? ' selected' : ''}`); marker.setAttribute('tabindex', '0'); marker.setAttribute('role', 'button');
      marker.setAttribute('aria-label', `${x.name}: composite score ${show(score(x))} out of 100`);
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
    const topic = value => ({ buy: 'Buying', rent: 'Renting', market: 'Market', localTransport: 'Public-transport connectivity', nationalTransport: 'Rail connections', quiet: 'Quietness', condition: 'Local condition' }[value] || value);
    const label = source => {
      const url = source.url;
      if (url.includes('price-paid-data-downloads')) return 'HM Land Registry price-paid data';
      if (url.includes('priceindexofprivaterentsukmonthlypricestatistics')) return 'ONS private-rent statistics';
      if (url.includes('privaterentandhousepricesuk')) return 'ONS rent and house-price bulletin';
      if (url.includes('property-for-sale')) return 'Rightmove one-bedroom flats for sale';
      if (url.includes('property-to-rent')) return 'Rightmove one-bedroom flats to rent';
      if (url.includes('los.rightmove')) return 'Rightmove location lookup';
      if (url.includes('nationalrail.co.uk')) return 'National Rail journey planner';
      if (url.includes('transport-connectivity-metric')) return 'DfT transport connectivity metric';
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
      ? [row('Recent sales price', money(x.buy.proxyMedian), recentSalesDefinition), row('Completed sales in sample', known(x.buy.transactions) ? `${show(x.buy.transactions)} sales` : 'Not available'), row('One-bedroom listings', known(x.buy.oneBedCount) ? `${show(x.buy.oneBedCount)} listings` : 'Not available', 'Rightmove headline count at the recorded snapshot; listings are not deduplicated.')]
      : [row('Typical one-bedroom rent', `${money(x.rent.proxyMonthly)}${known(x.rent.proxyMonthly) ? ' per month' : ''}`, 'Modelled monthly local-authority average; not an asking-rent median.'), row('One-bedroom listings', known(x.rent.oneBedCount) ? `${show(x.rent.oneBedCount)} listings` : 'Not available', 'Rightmove headline count at the recorded snapshot; listings are not deduplicated.')];
    const assessmentNote = 'Explicit broad-assessment band. The accompanying reason explains the judgement but does not determine the score.';
    const localRows = [row('Public-transport connectivity', known(x.localTransport.pt_connectivity_0_100) ? `${oneDecimal(x.localTransport.pt_connectivity_0_100)} out of 100` : 'Not available', localTransportDefinition), row('National population percentile', known(x.localTransport.national_percentile) ? `${oneDecimal(x.localTransport.national_percentile)}th percentile` : 'Not available', 'Compared with the Census-population-weighted distribution of all England and Wales Output Areas in the same DfT release; higher is better.'), row('Measurement area', show(x.localTransport.reason), 'A reviewed April 2024 built-up-area mapping; composite locations combine all named built-up areas using Census population weights.'), row('Source period', show(x.localTransport.source_period)), row('Quietness assessment', assessment('quiet', x.quiet.assessment), assessmentNote), row('Quietness reason', show(x.quiet.reason)), row('Local condition assessment', assessment('condition', x.condition.assessment), assessmentNote), row('Local condition reason', show(x.condition.reason))];
    $('details').innerHTML = `<p class="eyebrow">${escape(x.country)} · ${escape(x.localAuthority)}</p><h2>${escape(x.name)}</h2><div class="headline-grid"><div class="score-card ${band(x)}"><span>${state.tenure === 'buy' ? 'Buying' : 'Renting'} composite score</span><strong>${show(score(x))}<small>out of 100</small></strong></div><div><span>${state.tenure === 'buy' ? help('Recent sales price', recentSalesDefinition) : 'Typical one-bedroom rent'}</span><strong>${money(price(x))}${state.tenure === 'rent' ? '<small>per month</small>' : ''}</strong></div></div><section class="detail-section score-section"><div class="section-heading"><h3>Score components</h3><span>Each score is out of 5</span></div><div class="component-grid">${factorRows}</div></section>${section(state.tenure === 'buy' ? 'Buying evidence' : 'Renting evidence', priceRows, [['Price', factorValues.housing_cost], ['Listings', factorValues.stock]])}${section('Rail connections', [row('To London', minutes(x.nationalTransport.londonMinutes, x.nationalTransport.londonChanges)), row('To Birmingham', minutes(x.nationalTransport.birminghamMinutes, x.nationalTransport.birminghamChanges))], [['Rail', factorValues.national_transport]])}${section('Recorded offences', [row('Violence against the person', `${show(offences?.violence_against_person?.rate_per_1000)} per 1,000${offences?.violence_against_person ? ` · ${escape(offences.violence_against_person.csp_name)} CSP` : ''}`, 'Recorded rate for Apr 2025–Mar 2026.'), row('Sexual offences', `${show(offences?.sexual_offences?.rate_per_1000)} per 1,000${offences?.sexual_offences ? ` · ${escape(offences.sexual_offences.csp_name)} CSP` : ''}`, 'Recorded rate for Apr 2025–Mar 2026.')], [['Offences', factorValues.safety]])}${section('Local picture', localRows, [['Transport', factorValues.local_transport], ['Quiet', factorValues.quiet], ['Condition', factorValues.condition]])}${sources(x)}`;
    $('details').querySelectorAll('.help').forEach(button => button.addEventListener('click', () => {
      const text = button.nextElementSibling, willOpen = text.hidden;
      closeHelp();
      text.hidden = !willOpen;
      button.setAttribute('aria-expanded', String(willOpen));
    }));
  }
  function renderTable(locations) {
    $('rows').innerHTML = locations.map(x => `<tr class="${x.id === state.selectedId ? 'is-selected' : ''}"><td><button data-id="${escape(x.id)}">${escape(x.name)}</button><small>${escape(x.localAuthority)} · ${escape(x.country)}</small></td><td><strong>${show(score(x))}</strong><small>out of 100</small></td><td>${money(price(x))}${state.tenure === 'buy' && known(x.buy.transactions) ? `<small>${x.buy.transactions} completed sales</small>` : ''}</td><td>${show(stock(x))}</td><td>${minutes(x.nationalTransport.londonMinutes, x.nationalTransport.londonChanges)}</td><td>${minutes(x.nationalTransport.birminghamMinutes, x.nationalTransport.birminghamChanges)}</td><td>${show(rate(x, 'violence_against_person'))}</td><td>${show(rate(x, 'sexual_offences'))}</td></tr>`).join('');
    $('rows').querySelectorAll('button').forEach(button => button.addEventListener('click', () => select(button.dataset.id, true)));
  }
  function renderSortHeadings() {
    const headings = { name: 'nameHeading', score: 'scoreHeading', price: 'priceHeading', stock: 'stockHeading', london: 'londonHeading', birmingham: 'birminghamHeading', violence: 'violenceHeading', sexual: 'sexualHeading' };
    const labels = { name: 'Location / local authority', score: 'Composite score out of 100', price: state.tenure === 'buy' ? 'Recent sales price' : 'Typical one-bedroom rent / month', stock: 'One-bedroom listings', london: 'London rail', birmingham: 'Birmingham rail', violence: 'Violence / 1,000', sexual: 'Sexual offences / 1,000' };
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
  function renderMapKey() {
    const format = value => Number.isInteger(value) ? String(value) : String(value).replace(/\.0$/, '');
    ['high', 'mid', 'low'].forEach(bandName => {
      const range = data.composite.score_bands[state.tenure][bandName];
      const item = $(`${bandName}ScoreRange`).parentElement;
      item.hidden = !range.count;
      if (!range.count) return;
      $(`${bandName}ScoreRange`).textContent = range.minimum === range.maximum
        ? format(range.minimum) : `${format(range.minimum)}–${format(range.maximum)}`;
    });
  }
  function render() { const locations = filtered(); $('count').textContent = `${locations.length} of ${data.locations.length} locations shown on the map`; $('resultSummary').textContent = `Showing ${locations.length} of ${data.locations.length}`; renderMapKey(); renderMap(locations); renderDetail(); renderTable(ordered(locations)); renderSortHeadings(); }
  function select(id, scroll = false) { state.selectedId = id; render(); if (scroll && matchMedia('(max-width: 920px)').matches) $('details').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  function setTenure(tenure) { state.tenure = tenure; $('buyToggle').setAttribute('aria-pressed', tenure === 'buy'); $('rentToggle').setAttribute('aria-pressed', tenure === 'rent'); render(); }
  populateLocations();
  $('locationSelect').addEventListener('input', e => { state.locationId = e.target.value; render(); });
  $('country').addEventListener('input', e => { state.country = e.target.value; render(); });
  $('buyToggle').addEventListener('click', () => setTenure('buy')); $('rentToggle').addEventListener('click', () => setTenure('rent'));
  $('reset').addEventListener('click', () => { state.locationId = ''; state.country = 'all'; state.sort = 'score'; state.sortDirection = 'desc'; $('locationSelect').value = ''; $('country').value = 'all'; render(); });
  document.addEventListener('click', event => { if (!event.target.closest('.help-wrap')) closeHelp(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeHelp(); });
  $('evidence').innerHTML = data.evidence.filter(x => x.workstream !== 'geography_crime' || x.id === 'CRIME-ONS-2026-CSP').map(x => `<h3>${escape(x.title)}</h3><p>${escape(x.dataPeriod)} · Recorded retrieval: ${escape(x.retrievalDate)} · ${escape(x.geography)}</p><p>${escape(x.limitations)}</p>`).join('');
  render();
})();
