(() => {
  'use strict';
  const data = window.FLATS_DATA;
  if (!data || !Array.isArray(data.locations)) return;
  const MAP = { minLon: -6.4, maxLon: 2, minLat: 49.6, maxLat: 58.9, width: 560, height: 720 };
  const $ = id => document.getElementById(id);
  const byId = new Map(data.locations.map(x => [x.id, x]));
  const crime = new Map();
  data.crimeResearch.forEach(x => { if (!crime.has(x.location_id)) crime.set(x.location_id, {}); crime.get(x.location_id)[x.category] = x; });
  const state = { tenure: 'buy', locationId: '', country: 'all', sort: 'score', selectedId: data.locations[0]?.id };
  const escape = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const known = v => v !== null && v !== undefined && v !== '';
  const show = v => known(v) ? escape(v) : 'Not available';
  const money = v => known(v) ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(v) : 'Not available';
  const minutes = (v, c) => known(v) ? `${v} min${known(c) ? ` · ${c} change${c === 1 ? '' : 's'}` : ''}` : 'Not available';
  const price = x => x[state.tenure][state.tenure === 'buy' ? 'proxyMedian' : 'proxyMonthly'];
  const stock = x => x[state.tenure].oneBedCount;
  const score = x => data.screening.results[x.id].tenures[state.tenure].score;
  const band = x => !known(score(x)) ? 'score-unknown' : score(x) >= 70 ? 'score-high' : score(x) >= 55 ? 'score-mid' : 'score-low';
  const rate = (x, category) => crime.get(x.id)?.[category]?.rate_per_1000;
  const project = x => [((x.lon - MAP.minLon) / (MAP.maxLon - MAP.minLon)) * MAP.width, MAP.height - ((x.lat - MAP.minLat) / (MAP.maxLat - MAP.minLat)) * MAP.height];
  const help = (label, text = '') => `${escape(label)}${text ? ` <span class="help-wrap"><button class="help" type="button" aria-expanded="false" aria-label="Show more information about ${escape(label)}">?</button><span class="help-text" hidden>${escape(text)}</span></span>` : ''}`;
  const row = (label, value, text = '') => `<dt>${help(label, text)}</dt><dd>${value}</dd>`;
  const section = (title, rows) => `<section class="detail-section"><h3>${title}</h3><dl>${rows.join('')}</dl></section>`;
  const factors = {
    affordability: ['Affordability', 'Compared with the other locations shown; lower prices score higher.'],
    safety: ['Recorded offences', 'Compares recorded rates for two offence types across broad CSP areas. Rates can be affected by reporting, recording practice, visitors and commuters, and area boundaries; they do not describe unreported crime, personal risk, or variation between streets and times.'],
    local_transport: ['Local transport', 'Broad town or city assessment of bus and rail coverage.'],
    condition: ['Local condition', 'Broad assessment of the town or city’s physical condition.'],
    quiet: ['Quietness', 'Broad assessment of likely noise exposure across the town or city.'],
    stock: ['One-bedroom listings', 'Portal headline count at the recorded snapshot; listings are not deduplicated.'],
    national_transport: ['Rail connections', 'Representative journeys to London and Birmingham, including an allowance for changes.']
  };

  function filtered() { return data.locations.filter(x => (!state.locationId || x.id === state.locationId) && (state.country === 'all' || x.country === state.country)); }
  function ordered(locations) {
    return [...locations].sort((a, b) => {
      if (state.sort === 'score') return (score(b) ?? -Infinity) - (score(a) ?? -Infinity) || a.name.localeCompare(b.name);
      if (state.sort === 'price') return (price(a) ?? Infinity) - (price(b) ?? Infinity) || a.name.localeCompare(b.name);
      if (state.sort === 'stock') return (stock(b) ?? -Infinity) - (stock(a) ?? -Infinity) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }
  function populateLocations() {
    data.locations.slice().sort((a, b) => a.name.localeCompare(b.name)).forEach(x => {
      const option = document.createElement('option'); option.value = x.id; option.textContent = `${x.name} — ${x.localAuthority}`; $('locationSelect').appendChild(option);
    });
  }
  function tooltip(x, target) {
    const box = $('mapWrap').getBoundingClientRect(), marker = target.getBoundingClientRect();
    $('mapTooltip').innerHTML = `<strong>${escape(x.name)}</strong><span>Screening score: ${show(score(x))} out of 100</span><span>${money(price(x))}${state.tenure === 'rent' ? ' per month' : ''} · ${show(stock(x))} one-bedroom listings</span>`;
    $('mapTooltip').style.left = `${marker.left - box.left + marker.width / 2}px`; $('mapTooltip').style.top = `${marker.top - box.top - 8}px`; $('mapTooltip').hidden = false;
  }
  function renderMap(locations) {
    const group = $('mapMarkers'); group.replaceChildren();
    const ids = new Set(locations.map(x => x.id)); if (!ids.has(state.selectedId)) state.selectedId = locations[0]?.id;
    locations.filter(x => known(x.lat) && known(x.lon)).forEach(x => {
      const [cx, cy] = project(x), marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      marker.setAttribute('cx', cx.toFixed(2)); marker.setAttribute('cy', cy.toFixed(2)); marker.setAttribute('r', x.id === state.selectedId ? '9' : '6');
      marker.setAttribute('class', `map-marker ${band(x)}${x.id === state.selectedId ? ' selected' : ''}`); marker.setAttribute('tabindex', '0'); marker.setAttribute('role', 'button');
      marker.setAttribute('aria-label', `${x.name}: screening score ${show(score(x))} out of 100`);
      marker.addEventListener('mouseenter', () => tooltip(x, marker)); marker.addEventListener('mouseleave', () => { $('mapTooltip').hidden = true; });
      marker.addEventListener('focus', () => tooltip(x, marker)); marker.addEventListener('blur', () => { $('mapTooltip').hidden = true; });
      marker.addEventListener('click', () => select(x.id)); marker.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(x.id); } }); group.appendChild(marker);
      if (x.id === state.selectedId) { const label = document.createElementNS('http://www.w3.org/2000/svg', 'text'); label.setAttribute('x', (cx + 13).toFixed(2)); label.setAttribute('y', (cy + 4).toFixed(2)); label.setAttribute('class', 'selected-map-label'); label.textContent = x.name; group.appendChild(label); }
    });
  }
  function sources(x) {
    const list = data.sources.filter(s => s.location_id === x.id && s.topic !== 'crime');
    const topic = value => ({ buy: 'Buying', rent: 'Renting', market: 'Market', localTransport: 'Local transport', nationalTransport: 'Rail connections', quiet: 'Quietness', condition: 'Local condition' }[value] || value);
    const label = source => {
      const url = source.url;
      if (url.includes('price-paid-data-downloads')) return 'HM Land Registry price-paid data';
      if (url.includes('priceindexofprivaterentsukmonthlypricestatistics')) return 'ONS private-rent statistics';
      if (url.includes('privaterentandhousepricesuk')) return 'ONS rent and house-price bulletin';
      if (url.includes('property-for-sale')) return 'Rightmove one-bedroom flats for sale';
      if (url.includes('property-to-rent')) return 'Rightmove one-bedroom flats to rent';
      if (url.includes('los.rightmove')) return 'Rightmove location lookup';
      if (url.includes('nationalrail.co.uk')) return 'National Rail journey planner';
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
    return list.length ? `<details class="source-details"><summary>Source links</summary><ul class="source-links">${list.map(s => `<li><span>${escape(topic(s.topic))}</span> <a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(label(s))}</a></li>`).join('')}</ul></details>` : '';
  }
  function renderDetail() {
    const x = byId.get(state.selectedId); if (!x) { $('details').innerHTML = '<p>No location matches the current view.</p>'; return; }
    const offences = crime.get(x.id), factorRows = Object.entries(data.screening.results[x.id].tenures[state.tenure].factors).map(([key, value]) => {
      const [label, note] = factors[key] || [key, '']; return `<div class="component"><span>${help(label, note)}</span><strong class="score-pill score-${known(value) ? Math.ceil(value) : 'unknown'}">${show(value)}</strong></div>`;
    }).join('');
    const priceRows = state.tenure === 'buy'
      ? [row('Typical achieved flat price', money(x.buy.proxyMedian), 'Median completed price for flats of all sizes; not a one-bedroom estimate.'), row('Completed sales in sample', known(x.buy.transactions) ? `${show(x.buy.transactions)} sales` : 'Not available'), row('One-bedroom listings', known(x.buy.oneBedCount) ? `${show(x.buy.oneBedCount)} listings` : 'Not available', 'Portal headline count at the recorded snapshot; listings are not deduplicated.')]
      : [row('Typical one-bedroom rent', `${money(x.rent.proxyMonthly)}${known(x.rent.proxyMonthly) ? ' per month' : ''}`, 'Modelled monthly local-authority average; not an asking-rent median.'), row('One-bedroom listings', known(x.rent.oneBedCount) ? `${show(x.rent.oneBedCount)} listings` : 'Not available', 'Portal headline count at the recorded snapshot; listings are not deduplicated.')];
    const localRows = [row('Local transport', show(x.localTransport.reason)), row('Quietness', show(x.quiet.reason)), row('Local condition', show(x.condition.reason))];
    $('details').innerHTML = `<p class="eyebrow">${escape(x.country)} · ${escape(x.localAuthority)}</p><h2>${escape(x.name)}</h2><div class="headline-grid"><div class="score-card ${band(x)}"><span>${state.tenure === 'buy' ? 'Buying' : 'Renting'} screening score</span><strong>${show(score(x))}<small>out of 100</small></strong></div><div><span>${state.tenure === 'buy' ? 'Typical achieved flat price' : 'Typical one-bedroom rent'}</span><strong>${money(price(x))}${state.tenure === 'rent' ? '<small>per month</small>' : ''}</strong></div></div><section class="detail-section score-section"><div class="section-heading"><h3>Screen components</h3><span>Each score is out of 5</span></div><div class="component-grid">${factorRows}</div></section>${section(state.tenure === 'buy' ? 'Buying evidence' : 'Renting evidence', priceRows)}${section('Rail connections', [row('To London', minutes(x.nationalTransport.londonMinutes, x.nationalTransport.londonChanges)), row('To Birmingham', minutes(x.nationalTransport.birminghamMinutes, x.nationalTransport.birminghamChanges))])}${section('Recorded offences', [row('Violence against the person', `${show(offences?.violence_against_person?.rate_per_1000)} per 1,000${offences?.violence_against_person ? ` · ${escape(offences.violence_against_person.csp_name)} CSP` : ''}`, 'Recorded rate for Apr 2025–Mar 2026.'), row('Sexual offences', `${show(offences?.sexual_offences?.rate_per_1000)} per 1,000${offences?.sexual_offences ? ` · ${escape(offences.sexual_offences.csp_name)} CSP` : ''}`, 'Recorded rate for Apr 2025–Mar 2026.')])}${section('Local picture', localRows)}${sources(x)}`;
    $('details').querySelectorAll('.help').forEach(button => button.addEventListener('click', () => {
      const text = button.nextElementSibling, willOpen = text.hidden;
      $('details').querySelectorAll('.help-text').forEach(other => { other.hidden = true; });
      $('details').querySelectorAll('.help').forEach(other => other.setAttribute('aria-expanded', 'false'));
      text.hidden = !willOpen;
      button.setAttribute('aria-expanded', String(willOpen));
    }));
  }
  function renderTable(locations) {
    $('priceHeading').textContent = state.tenure === 'buy' ? 'Typical achieved flat price' : 'Typical one-bedroom rent / month';
    $('rows').innerHTML = locations.map(x => `<tr class="${x.id === state.selectedId ? 'is-selected' : ''}"><td><button data-id="${escape(x.id)}">${escape(x.name)}</button><small>${escape(x.localAuthority)} · ${escape(x.country)}</small></td><td><strong>${show(score(x))}</strong><small>out of 100</small></td><td>${money(price(x))}${state.tenure === 'buy' && known(x.buy.transactions) ? `<small>${x.buy.transactions} completed sales</small>` : ''}</td><td>${show(stock(x))}</td><td>${minutes(x.nationalTransport.londonMinutes, x.nationalTransport.londonChanges)}</td><td>${minutes(x.nationalTransport.birminghamMinutes, x.nationalTransport.birminghamChanges)}</td><td>${show(rate(x, 'violence_against_person'))}</td><td>${show(rate(x, 'sexual_offences'))}</td></tr>`).join('');
    $('rows').querySelectorAll('button').forEach(button => button.addEventListener('click', () => select(button.dataset.id, true)));
  }
  function render() { const locations = filtered(); $('count').textContent = `${locations.length} of ${data.locations.length} locations shown on the map`; $('resultSummary').textContent = `Showing ${locations.length} of ${data.locations.length}`; renderMap(locations); renderDetail(); renderTable(ordered(locations)); }
  function select(id, scroll = false) { state.selectedId = id; render(); if (scroll && matchMedia('(max-width: 920px)').matches) $('details').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  function setTenure(tenure) { state.tenure = tenure; $('buyToggle').setAttribute('aria-pressed', tenure === 'buy'); $('rentToggle').setAttribute('aria-pressed', tenure === 'rent'); render(); }
  populateLocations();
  $('locationSelect').addEventListener('input', e => { state.locationId = e.target.value; render(); });
  $('country').addEventListener('input', e => { state.country = e.target.value; render(); });
  $('sort').addEventListener('input', e => { state.sort = e.target.value; render(); });
  $('buyToggle').addEventListener('click', () => setTenure('buy')); $('rentToggle').addEventListener('click', () => setTenure('rent'));
  $('reset').addEventListener('click', () => { state.locationId = ''; state.country = 'all'; state.sort = 'score'; $('locationSelect').value = ''; $('country').value = 'all'; $('sort').value = 'score'; render(); });
  $('evidence').innerHTML = data.evidence.filter(x => x.workstream !== 'geography_crime' || x.id === 'CRIME-ONS-2026-CSP').map(x => `<h3>${escape(x.title)}</h3><p>${escape(x.dataPeriod)} · Recorded retrieval: ${escape(x.retrievalDate)} · ${escape(x.geography)}</p><p>${escape(x.limitations)}</p>`).join('');
  render();
})();
