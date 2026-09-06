(() => {
  'use strict';
  const data = window.FLATS_DATA;
  if (!data || !Array.isArray(data.locations)) return;
  // Matches the archived offline Great Britain outline in index.html.
  const MAP = { minLon: -6.4, maxLon: 2, minLat: 49.6, maxLat: 58.9, width: 560, height: 720 };
  const $ = id => document.getElementById(id);
  const byId = new Map(data.locations.map(location => [location.id, location]));
  const crimeByLocation = new Map();
  data.crimeResearch.forEach(row => {
    if (!crimeByLocation.has(row.location_id)) crimeByLocation.set(row.location_id, {});
    crimeByLocation.get(row.location_id)[row.category] = row;
  });
  const state = { tenure: 'buy', search: '', country: 'all', sort: 'score', selectedId: data.locations[0]?.id };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const known = value => value !== null && value !== undefined && value !== '';
  const show = value => known(value) ? escape(value) : 'Unknown';
  const money = value => known(value) ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value) : 'Unknown';
  const minutes = (value, changes) => known(value) ? `${value} min${known(changes) ? ` · ${changes} change${changes === 1 ? '' : 's'}` : ''}` : 'Unknown';
  const price = location => location[state.tenure][state.tenure === 'buy' ? 'proxyMedian' : 'proxyMonthly'];
  const stock = location => location[state.tenure].oneBedCount;
  const rate = (location, category) => crimeByLocation.get(location.id)?.[category]?.rate_per_1000;
  const screening = location => data.screening.results[location.id].tenures[state.tenure];
  const score = location => screening(location).score;
  const scoreBand = location => !known(score(location)) ? 'score-unknown' : score(location) >= 70 ? 'score-high' : score(location) >= 55 ? 'score-mid' : 'score-low';
  const project = location => [((location.lon - MAP.minLon) / (MAP.maxLon - MAP.minLon)) * MAP.width, MAP.height - ((location.lat - MAP.minLat) / (MAP.maxLat - MAP.minLat)) * MAP.height];

  function visibleLocations() {
    const query = state.search.trim().toLowerCase();
    return data.locations.filter(location => (!query || `${location.name} ${location.localAuthority}`.toLowerCase().includes(query)) && (state.country === 'all' || location.country === state.country)).sort((a, b) => {
      if (state.sort === 'score') return (score(b) ?? -Infinity) - (score(a) ?? -Infinity) || a.name.localeCompare(b.name);
      if (state.sort === 'price') return (price(a) ?? Infinity) - (price(b) ?? Infinity) || a.name.localeCompare(b.name);
      if (state.sort === 'stock') return (stock(b) ?? -Infinity) - (stock(a) ?? -Infinity) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }

  function tooltip(location, target) {
    const box = $('mapWrap').getBoundingClientRect();
    const marker = target.getBoundingClientRect();
    $('mapTooltip').innerHTML = `<strong>${escape(location.name)}</strong><span>Screen ${show(score(location))}/100</span><span>${money(price(location))}${state.tenure === 'rent' ? ' per month' : ''} · ${show(stock(location))} one-bed portal results</span>`;
    $('mapTooltip').style.left = `${marker.left - box.left + marker.width / 2}px`;
    $('mapTooltip').style.top = `${marker.top - box.top - 8}px`;
    $('mapTooltip').hidden = false;
  }

  function renderMap(locations) {
    const markerGroup = $('mapMarkers');
    markerGroup.replaceChildren();
    const ids = new Set(locations.map(location => location.id));
    if (!ids.has(state.selectedId)) state.selectedId = locations[0]?.id;
    locations.filter(location => known(location.lat) && known(location.lon)).forEach(location => {
      const [x, y] = project(location);
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      marker.setAttribute('cx', x.toFixed(2)); marker.setAttribute('cy', y.toFixed(2));
      marker.setAttribute('r', location.id === state.selectedId ? '9' : '6');
      marker.setAttribute('class', `map-marker ${scoreBand(location)}${location.id === state.selectedId ? ' selected' : ''}`);
      marker.setAttribute('tabindex', '0'); marker.setAttribute('role', 'button');
      marker.setAttribute('aria-label', `${location.name}, ${location.country}: screening score ${show(score(location))} out of 100; ${money(price(location))}; ${show(stock(location))} one-bed portal results`);
      marker.addEventListener('mouseenter', () => tooltip(location, marker));
      marker.addEventListener('mouseleave', () => { $('mapTooltip').hidden = true; });
      marker.addEventListener('focus', () => tooltip(location, marker));
      marker.addEventListener('blur', () => { $('mapTooltip').hidden = true; });
      marker.addEventListener('click', () => select(location.id));
      marker.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(location.id); } });
      markerGroup.appendChild(marker);
      if (location.id === state.selectedId) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', (x + 13).toFixed(2)); label.setAttribute('y', (y + 4).toFixed(2)); label.setAttribute('class', 'selected-map-label'); label.textContent = location.name;
        markerGroup.appendChild(label);
      }
    });
  }

  function sourceLinks(location) {
    const sources = data.sources.filter(source => source.location_id === location.id && source.topic !== 'crime');
    return sources.length ? `<h3>Source links</h3><ul class="source-links">${sources.map(source => `<li>${escape(source.topic)}: <a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.url)}</a></li>`).join('')}</ul>` : '';
  }

  function renderDetail() {
    const location = byId.get(state.selectedId);
    if (!location) { $('details').innerHTML = '<p>No location matches the current view.</p>'; return; }
    const crime = crimeByLocation.get(location.id);
    const groups = [['buy', 'Buying: all-flat proxy'], ['rent', 'Renting: modelled one-bedroom LA mean'], ['market', 'Market snapshot'], ['localTransport', 'Local transport'], ['nationalTransport', 'National rail'], ['quiet', 'Quiet'], ['condition', 'Local condition']];
    const factors = screening(location).factors;
    $('details').innerHTML = `<p class="eyebrow">${escape(location.country)} · ${escape(location.localAuthority)}</p><h2>${escape(location.name)}</h2><div class="headline-grid"><div><span>${state.tenure === 'buy' ? 'Buying' : 'Renting'} screening score</span><strong>${show(score(location))}<small>/100</small></strong></div><div><span>${state.tenure === 'buy' ? 'All-flat achieved median' : 'Modelled one-bed LA mean'}</span><strong>${money(price(location))}${state.tenure === 'rent' ? '<small>per month</small>' : ''}</strong></div></div><section class="detail-section"><h3>Screen components</h3><p>1–5 ordinal values; weights: affordability, safety, local transport, condition, quiet and one-bed stock 15 each; national transport 10.</p><dl>${Object.entries(factors).map(([field, value]) => `<dt>${escape(field.replaceAll('_', ' '))}</dt><dd>${show(value)} / 5</dd>`).join('')}</dl></section><section class="detail-section"><h3>Recorded offences (CSP; Apr 2025–Mar 2026)</h3><p>${escape(data.screening.safety_note)}</p><dl><dt>Violence against the person</dt><dd>${show(crime?.violence_against_person?.rate_per_1000)} per 1,000${crime?.violence_against_person ? ` · ${escape(crime.violence_against_person.csp_name)} CSP · ${show(crime.violence_against_person.count)} offences` : ''}</dd><dt>Sexual offences</dt><dd>${show(crime?.sexual_offences?.rate_per_1000)} per 1,000${crime?.sexual_offences ? ` · ${escape(crime.sexual_offences.csp_name)} CSP · ${show(crime.sexual_offences.count)} offences` : ''}</dd></dl></section>${groups.map(([key, label]) => `<section class="detail-section"><h3>${label}</h3><dl>${Object.entries(location[key]).map(([field, value]) => `<dt>${escape(field)}</dt><dd>${show(value)}</dd>`).join('')}</dl></section>`).join('')}${sourceLinks(location)}`;
  }

  function renderTable(locations) {
    $('priceHeading').textContent = state.tenure === 'buy' ? 'All-flat achieved median' : 'One-bed LA modelled mean / month';
    $('rows').innerHTML = locations.map(location => `<tr class="${location.id === state.selectedId ? 'is-selected' : ''}"><td><button data-id="${escape(location.id)}">${escape(location.name)}</button><small>${escape(location.localAuthority)} · ${escape(location.country)}</small></td><td><strong>${show(score(location))}</strong><small>/100</small></td><td>${money(price(location))}${state.tenure === 'buy' && known(location.buy.transactions) ? `<small>${location.buy.transactions} transactions</small>` : ''}</td><td>${show(stock(location))}</td><td>${minutes(location.nationalTransport.londonMinutes, location.nationalTransport.londonChanges)}</td><td>${minutes(location.nationalTransport.birminghamMinutes, location.nationalTransport.birminghamChanges)}</td><td>${show(rate(location, 'violence_against_person'))}</td><td>${show(rate(location, 'sexual_offences'))}</td></tr>`).join('');
    $('rows').querySelectorAll('button').forEach(button => button.addEventListener('click', () => select(button.dataset.id, true)));
  }

  function render() {
    const locations = visibleLocations();
    $('count').textContent = `${locations.length} of ${data.locations.length} locations shown on the map`;
    $('resultSummary').textContent = `Showing ${locations.length} of ${data.locations.length}`;
    renderMap(locations); renderDetail(); renderTable(locations);
  }
  function select(id, scrollDetail = false) { state.selectedId = id; render(); if (scrollDetail && matchMedia('(max-width: 920px)').matches) $('details').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  function setTenure(tenure) { state.tenure = tenure; $('buyToggle').setAttribute('aria-pressed', tenure === 'buy'); $('rentToggle').setAttribute('aria-pressed', tenure === 'rent'); render(); }
  $('search').addEventListener('input', event => { state.search = event.target.value; render(); });
  $('country').addEventListener('input', event => { state.country = event.target.value; render(); });
  $('sort').addEventListener('input', event => { state.sort = event.target.value; render(); });
  $('buyToggle').addEventListener('click', () => setTenure('buy'));
  $('rentToggle').addEventListener('click', () => setTenure('rent'));
  $('reset').addEventListener('click', () => { state.search = ''; state.country = 'all'; state.sort = 'score'; $('search').value = ''; $('country').value = 'all'; $('sort').value = 'score'; render(); });
  $('evidence').innerHTML = data.evidence.filter(entry => entry.workstream !== 'geography_crime' || entry.id === 'CRIME-ONS-2026-CSP').map(entry => `<h3>${escape(entry.title)}</h3><p>${escape(entry.dataPeriod)} · Recorded retrieval: ${escape(entry.retrievalDate)} · ${escape(entry.geography)}</p><p>${escape(entry.limitations)}</p>`).join('');
  render();
})();
