(() => {
  'use strict';

  const DATA = window.STAGE1_DATA;
  if (!DATA || !Array.isArray(DATA.locations)) {
    document.body.innerHTML = '<p style="padding:2rem;font-family:sans-serif">Could not load locations.js.</p>';
    return;
  }

  const MAP = { minLon: -6.4, maxLon: 2.0, minLat: 49.6, maxLat: 58.9, width: 560, height: 720 };
  const byId = new Map(DATA.locations.map((location) => [location.id, location]));
  const initial = [...DATA.locations].sort((a, b) => b.buy.screenScore - a.buy.screenScore)[0];

  const state = {
    tenure: 'buy',
    selectedId: initial.id,
    search: '',
    minScore: 0,
    minSafety: 'any',
    country: 'all',
    minConfidence: 0,
    sort: 'score-desc'
  };

  const $ = (selector) => document.querySelector(selector);
  const refs = {
    buyToggle: $('#buyToggle'),
    rentToggle: $('#rentToggle'),
    searchInput: $('#searchInput'),
    minScore: $('#minScore'),
    minScoreValue: $('#minScoreValue'),
    safetyFilter: $('#safetyFilter'),
    countryFilter: $('#countryFilter'),
    confidenceFilter: $('#confidenceFilter'),
    sortSelect: $('#sortSelect'),
    resetFilters: $('#resetFilters'),
    mapMarkers: $('#mapMarkers'),
    mapTooltip: $('#mapTooltip'),
    mapWrap: $('#mapWrap'),
    detailPanel: $('#detailPanel'),
    resultsBody: $('#resultsBody'),
    resultSummary: $('#resultSummary'),
    headlineHeader: $('#headlineHeader'),
    marketHeader: $('#marketHeader'),
    statVisible: $('#statVisible'),
    statMedian: $('#statMedian'),
    statHighest: $('#statHighest'),
    modeLabel: $('#modeLabel'),
    methodologyList: $('#methodologyList')
  };

  function escapeHTML(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function formatGBP(value) {
    if (value == null || Number.isNaN(Number(value))) return 'Unknown';
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);
  }

  function formatPcm(value) {
    if (value == null || Number.isNaN(Number(value))) return 'Unknown';
    return `${formatGBP(value)} pcm`;
  }

  function formatScore(value, max = 5) {
    if (value == null) return 'Unknown';
    return `${Number(value).toFixed(Number(value) % 1 ? 1 : 0)}/${max}`;
  }

  function formatMinutes(value, changes) {
    if (value == null) return 'Unknown';
    const h = Math.floor(value / 60);
    const m = value % 60;
    const duration = h ? `${h}h ${m ? `${m}m` : ''}`.trim() : `${m}m`;
    return `${duration} · ${changes ?? '?'} change${changes === 1 ? '' : 's'}`;
  }

  function tenureData(location) {
    return state.tenure === 'buy' ? location.buy : location.rent;
  }

  function headlineValue(location) {
    return state.tenure === 'buy' ? formatGBP(location.buy.proxyMedian) : formatPcm(location.rent.proxyMonthly);
  }

  function headlineLabel() {
    return state.tenure === 'buy' ? 'All-flat achieved median' : '1-bed modelled rent';
  }

  function marketCount(location) {
    return tenureData(location).oneBedCount;
  }

  function project(lon, lat) {
    const x = ((lon - MAP.minLon) / (MAP.maxLon - MAP.minLon)) * MAP.width;
    const y = MAP.height - ((lat - MAP.minLat) / (MAP.maxLat - MAP.minLat)) * MAP.height;
    return [x, y];
  }

  function visualBand(score) {
    if (score >= 70) return 'band-strongest';
    if (score >= 65) return 'band-strong';
    if (score >= 60) return 'band-middle';
    return 'band-lower';
  }

  function scoreDescriptor(score) {
    if (score >= 70) return '70+ band';
    if (score >= 65) return '65–69.9 band';
    if (score >= 60) return '60–64.9 band';
    return 'Below 60 band';
  }

  function factorTone(score) {
    if (score == null) return 'unknown';
    if (score >= 4) return 'good';
    if (score >= 3) return 'mid';
    return 'weak';
  }

  function filteredLocations() {
    const q = state.search.trim().toLowerCase();
    let rows = DATA.locations.filter((location) => {
      const t = tenureData(location);
      if (q && !`${location.name} ${location.localAuthority} ${location.country}`.toLowerCase().includes(q)) return false;
      if (Number(t.screenScore) < state.minScore) return false;
      if (state.minSafety !== 'any') {
        if (location.safety.score == null || Number(location.safety.score) < Number(state.minSafety)) return false;
      }
      if (state.country !== 'all' && location.country !== state.country) return false;
      if (Number(t.confidenceComposite ?? 0) < state.minConfidence) return false;
      return true;
    });

    rows.sort((a, b) => {
      const ta = tenureData(a);
      const tb = tenureData(b);
      if (state.sort === 'score-desc') return tb.screenScore - ta.screenScore || a.name.localeCompare(b.name);
      if (state.sort === 'headline-asc') {
        const av = state.tenure === 'buy' ? a.buy.proxyMedian : a.rent.proxyMonthly;
        const bv = state.tenure === 'buy' ? b.buy.proxyMedian : b.rent.proxyMonthly;
        return av - bv || a.name.localeCompare(b.name);
      }
      if (state.sort === 'market-desc') return tb.oneBedCount - ta.oneBedCount || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
    return rows;
  }

  function setSelected(id, scrollDetail = false) {
    if (!byId.has(id)) return;
    state.selectedId = id;
    renderMap();
    renderDetail();
    renderTable();
    if (scrollDetail && window.matchMedia('(max-width: 920px)').matches) {
      refs.detailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function showTooltip(location, target) {
    const t = tenureData(location);
    refs.mapTooltip.innerHTML = `
      <strong>${escapeHTML(location.name)}</strong>
      <span>${escapeHTML(headlineValue(location))}</span>
      <span>Screen ${Number(t.screenScore).toFixed(1)}/100 · ${escapeHTML(scoreDescriptor(t.screenScore))}</span>
    `;
    const wrapRect = refs.mapWrap.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const left = targetRect.left - wrapRect.left + targetRect.width / 2;
    const top = targetRect.top - wrapRect.top - 8;
    refs.mapTooltip.style.left = `${left}px`;
    refs.mapTooltip.style.top = `${top}px`;
    refs.mapTooltip.hidden = false;
  }

  function hideTooltip() {
    refs.mapTooltip.hidden = true;
  }

  function renderMap() {
    const visible = filteredLocations();
    const visibleIds = new Set(visible.map((l) => l.id));
    refs.mapMarkers.replaceChildren();

    if (!visibleIds.has(state.selectedId) && visible.length) state.selectedId = visible[0].id;

    visible.forEach((location) => {
      const [x, y] = project(location.lon, location.lat);
      const score = tenureData(location).screenScore;
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toFixed(2));
      circle.setAttribute('cy', y.toFixed(2));
      circle.setAttribute('r', location.id === state.selectedId ? '9' : '6');
      circle.setAttribute('class', `map-marker ${visualBand(score)} ${location.id === state.selectedId ? 'selected' : ''}`);
      circle.setAttribute('tabindex', '0');
      circle.setAttribute('role', 'button');
      circle.setAttribute('aria-label', `${location.name}, ${state.tenure} screening score ${Number(score).toFixed(1)} out of 100, ${headlineValue(location)}`);
      circle.dataset.id = location.id;

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${location.name} — ${Number(score).toFixed(1)}/100`;
      circle.appendChild(title);

      circle.addEventListener('mouseenter', () => showTooltip(location, circle));
      circle.addEventListener('mouseleave', hideTooltip);
      circle.addEventListener('focus', () => showTooltip(location, circle));
      circle.addEventListener('blur', hideTooltip);
      circle.addEventListener('click', () => setSelected(location.id));
      circle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setSelected(location.id);
        }
      });
      refs.mapMarkers.appendChild(circle);

      if (location.id === state.selectedId) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', (x + 13).toFixed(2));
        text.setAttribute('y', (y + 4).toFixed(2));
        text.setAttribute('class', 'selected-map-label');
        text.textContent = location.name;
        refs.mapMarkers.appendChild(text);
      }
    });
  }

  function factorCard(label, score, confidence, reason) {
    const tone = factorTone(score);
    const width = score == null ? 0 : Math.max(0, Math.min(100, (Number(score) / 5) * 100));
    return `
      <article class="factor-card ${tone}">
        <div class="factor-topline">
          <h4>${escapeHTML(label)}</h4>
          <span class="factor-score">${escapeHTML(formatScore(score))}</span>
        </div>
        <div class="factor-track" aria-hidden="true"><span style="width:${width}%"></span></div>
        <div class="factor-meta">${escapeHTML(confidence || 'Stage 1 proxy')}</div>
        <details>
          <summary>Evidence note</summary>
          <p>${escapeHTML(reason || 'No additional note recorded.')}</p>
        </details>
      </article>`;
  }

  function evidencePeriod(id) {
    const item = (DATA.evidence || []).find((entry) => entry.id === id);
    return item?.dataPeriod || 'Not recorded';
  }

  function sourceGroup(label, urls) {
    const unique = [...new Set((urls || []).filter((url) => /^https?:\/\//i.test(url)))];
    if (!unique.length) return '';
    const links = unique.map((url, i) => {
      let host = url;
      try { host = new URL(url).hostname.replace(/^www\./, ''); } catch (_) {}
      return `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(host)}${unique.length > 1 ? ` ${i + 1}` : ''}</a>`;
    }).join('');
    return `<div class="source-group"><span>${escapeHTML(label)}</span><div>${links}</div></div>`;
  }

  function renderDetail() {
    const location = byId.get(state.selectedId);
    if (!location) {
      refs.detailPanel.innerHTML = '<div class="empty-detail">No location matches the current filters.</div>';
      return;
    }
    const t = tenureData(location);
    const other = state.tenure === 'buy' ? location.rent : location.buy;
    const otherLabel = state.tenure === 'buy' ? 'Rent' : 'Buy';
    const factors = [
      ['Affordability', t.affordabilityScore, t.affordabilityConfidence, t.affordabilityReason],
      ['Personal safety', location.safety.score, location.safety.confidence, location.safety.reason],
      ['One-bed stock', t.stockScore, 'Portal snapshot', location.market.reason],
      ['Local transport', location.localTransport.score, location.localTransport.confidence, location.localTransport.reason],
      ['National transport', location.nationalTransport.score, location.nationalTransport.confidence, location.nationalTransport.reason],
      ['Quiet', location.quiet.score, location.quiet.confidence, location.quiet.reason],
      ['Local condition', location.condition.score, location.condition.confidence, location.condition.reason]
    ];

    const strong = factors.filter(([, score]) => score != null && Number(score) >= 4).map(([label]) => label);
    const weak = factors.filter(([, score]) => score == null || Number(score) <= 2.5).map(([label]) => label);
    const locationCautions = [];
    if (location.safety.score == null) locationCautions.push('Safety is unknown in this broad screen because comparable Police.uk data were unavailable.');
    if (location.market.towerSignal === 'Unclear') locationCautions.push('Tower/high-rise availability is unresolved; Stage 1 did not inspect buildings or individual listings.');
    if (state.tenure === 'buy') locationCautions.push('The buying value is an achieved median for flats/maisonettes of all sizes, not a one-bedroom median.');
    else locationCautions.push('The rent value is a modelled local-authority one-bedroom average, not a current new-let asking median.');
    if (location.seriousPriorityWeaknesses > 0) locationCautions.push(`${location.seriousPriorityWeaknesses} serious priority-factor weakness${location.seriousPriorityWeaknesses === 1 ? '' : 'es'} is flagged in the screen.`);

    const sources = [
      sourceGroup('Crime', location.sources.crime),
      sourceGroup('Buying', location.sources.buy),
      sourceGroup('Renting', location.sources.rent),
      sourceGroup('Market', location.sources.market),
      sourceGroup('Transport', location.sources.transport),
      sourceGroup('Environment', location.sources.environment)
    ].filter(Boolean).join('');

    refs.detailPanel.innerHTML = `
      <div class="detail-head">
        <div>
          <div class="eyebrow">${escapeHTML(location.country)} · ${escapeHTML(location.localAuthority)}</div>
          <h2>${escapeHTML(location.name)}</h2>
        </div>
        <span class="stage-chip">Stage 1</span>
      </div>

      <section class="score-hero ${visualBand(t.screenScore)}">
        <div>
          <span class="score-kicker">${state.tenure === 'buy' ? 'Buying' : 'Renting'} screening score</span>
          <strong>${Number(t.screenScore).toFixed(1)}<small>/100</small></strong>
          <span>${escapeHTML(scoreDescriptor(t.screenScore))} · not a final grade</span>
        </div>
        <div class="score-side">
          <span>Priority subtotal <b>${Number(t.priorityScore).toFixed(0)}/75</b></span>
          <span>Evidence confidence <b>${Number(t.confidenceComposite).toFixed(2)}/3</b></span>
          <span>Unknown factors <b>${t.unknowns ?? 0}</b></span>
        </div>
      </section>

      <section class="headline-grid">
        <div class="headline-card primary"><span>${escapeHTML(headlineLabel())}</span><strong>${escapeHTML(headlineValue(location))}</strong>${state.tenure === 'buy' ? `<small>${location.buy.transactions} achieved flat sales in proxy</small>` : '<small>Official modelled local-authority average</small>'}</div>
        <div class="headline-card"><span>1-bed portal count</span><strong>${t.oneBedCount}</strong><small>${state.tenure === 'buy' ? 'for sale' : 'to rent'} · one snapshot</small></div>
        <div class="headline-card"><span>${otherLabel} screen</span><strong>${Number(other.screenScore).toFixed(1)}/100</strong><small>${state.tenure === 'buy' ? formatPcm(location.rent.proxyMonthly) : formatGBP(location.buy.proxyMedian)}</small></div>
        <div class="headline-card"><span>Tower signal</span><strong>${escapeHTML(location.market.towerSignal)}</strong><small>not verified at Stage 1</small></div>
      </section>

      <section class="signal-summary">
        <div><span>Stronger screen signals</span><p>${strong.length ? escapeHTML(strong.join(' · ')) : 'None scored 4/5 or above.'}</p></div>
        <div><span>Weaker / unknown signals</span><p>${weak.length ? escapeHTML(weak.join(' · ')) : 'None scored 2.5/5 or below.'}</p></div>
      </section>

      <section class="detail-section">
        <div class="section-heading"><h3>Seven screening factors</h3><span>1–5 scale</span></div>
        <div class="factor-grid">${factors.map((f) => factorCard(...f)).join('')}</div>
      </section>

      <section class="detail-section">
        <div class="section-heading"><h3>National rail screen</h3><span>Representative weekday values</span></div>
        <div class="journey-grid">
          <div><span>London</span><strong>${escapeHTML(formatMinutes(location.nationalTransport.londonMinutes, location.nationalTransport.londonChanges))}</strong></div>
          <div><span>Birmingham</span><strong>${escapeHTML(formatMinutes(location.nationalTransport.birminghamMinutes, location.nationalTransport.birminghamChanges))}</strong></div>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-heading"><h3>Evidence timing</h3><span>Workbook periods</span></div>
        <div class="timing-grid">
          <div><span>Crime</span><strong>${escapeHTML(evidencePeriod('GC03'))}</strong></div>
          <div><span>Buying proxy</span><strong>${escapeHTML(evidencePeriod('AFF-BUY-PPD-2024-26'))}</strong></div>
          <div><span>Rental proxy</span><strong>${escapeHTML(evidencePeriod('AFF-RENT-PIPR-2026-07'))}</strong></div>
          <div><span>Market snapshot</span><strong>${escapeHTML(evidencePeriod('MT-RM-SEARCH-20260905'))}</strong></div>
        </div>
      </section>

      <section class="detail-section caution-section">
        <div class="section-heading"><h3>Read this before interpreting</h3><span>Location + stage caveats</span></div>
        <ul>${locationCautions.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
      </section>

      <section class="detail-section">
        <div class="section-heading"><h3>Recorded sources</h3><span>Open in new tab</span></div>
        <div class="sources-grid">${sources || '<p>No source links recorded.</p>'}</div>
      </section>
    `;
  }

  function renderTable() {
    const rows = filteredLocations();
    refs.resultsBody.innerHTML = rows.map((location) => {
      const t = tenureData(location);
      const selected = location.id === state.selectedId;
      return `
        <tr class="${selected ? 'is-selected' : ''}" data-id="${escapeHTML(location.id)}">
          <td><button class="row-select" type="button" data-id="${escapeHTML(location.id)}"><span>${escapeHTML(location.name)}</span><small>${escapeHTML(location.localAuthority)}</small></button></td>
          <td><strong>${Number(t.screenScore).toFixed(1)}</strong><small>/100</small></td>
          <td>${escapeHTML(headlineValue(location))}</td>
          <td>${escapeHTML(formatScore(location.safety.score))}</td>
          <td>${escapeHTML(formatScore(t.stockScore))}<small>${t.oneBedCount} listed</small></td>
          <td>${escapeHTML(formatScore(location.localTransport.score))}</td>
          <td>${escapeHTML(formatScore(location.quiet.score))}</td>
          <td>${escapeHTML(formatScore(location.condition.score))}</td>
          <td>${Number(t.confidenceComposite).toFixed(2)}<small>/3</small></td>
        </tr>`;
    }).join('');

    refs.resultsBody.querySelectorAll('.row-select').forEach((button) => {
      button.addEventListener('click', () => setSelected(button.dataset.id, true));
    });

    refs.headlineHeader.textContent = state.tenure === 'buy' ? 'Buy proxy' : 'Rent proxy';
    refs.marketHeader.textContent = state.tenure === 'buy' ? 'Sale stock' : 'Rental stock';
    refs.resultSummary.textContent = `Showing ${rows.length} of ${DATA.locations.length} locations`;
  }

  function median(numbers) {
    const sorted = [...numbers].sort((a, b) => a - b);
    if (!sorted.length) return null;
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function renderStats() {
    const visible = filteredLocations();
    const allScores = DATA.locations.map((l) => tenureData(l).screenScore);
    const max = Math.max(...allScores);
    refs.statVisible.textContent = `${visible.length}/${DATA.locations.length}`;
    refs.statMedian.textContent = `${median(allScores).toFixed(1)}`;
    refs.statHighest.textContent = `${max.toFixed(1)}`;
    refs.modeLabel.textContent = state.tenure === 'buy' ? 'Buying screen' : 'Renting screen';
  }

  function renderMethodology() {
    const w = DATA.meta.weights;
    const weighting = `Screen score weighting: affordability ${w.affordability}, safety ${w.safety}, local transport ${w.localTransport}, local condition ${w.condition}, quiet ${w.quiet}, one-bed/tower stock ${w.stock}, national transport ${w.nationalTransport}.`;
    refs.methodologyList.innerHTML = [weighting, ...DATA.meta.cautions].map((item) => `<li>${escapeHTML(item)}</li>`).join('');
  }

  function renderToggle() {
    const buy = state.tenure === 'buy';
    refs.buyToggle.classList.toggle('active', buy);
    refs.rentToggle.classList.toggle('active', !buy);
    refs.buyToggle.setAttribute('aria-pressed', String(buy));
    refs.rentToggle.setAttribute('aria-pressed', String(!buy));
  }

  function renderAll() {
    renderToggle();
    renderMap();
    renderDetail();
    renderTable();
    renderStats();
  }

  function setTenure(tenure) {
    if (tenure === state.tenure) return;
    state.tenure = tenure;
    const visible = filteredLocations();
    if (!visible.some((l) => l.id === state.selectedId) && visible.length) state.selectedId = visible[0].id;
    renderAll();
  }

  refs.buyToggle.addEventListener('click', () => setTenure('buy'));
  refs.rentToggle.addEventListener('click', () => setTenure('rent'));
  refs.searchInput.addEventListener('input', (event) => { state.search = event.target.value; renderAll(); });
  refs.minScore.addEventListener('input', (event) => {
    state.minScore = Number(event.target.value);
    refs.minScoreValue.textContent = state.minScore ? `${state.minScore}+` : 'Any';
    renderAll();
  });
  refs.safetyFilter.addEventListener('change', (event) => { state.minSafety = event.target.value; renderAll(); });
  refs.countryFilter.addEventListener('change', (event) => { state.country = event.target.value; renderAll(); });
  refs.confidenceFilter.addEventListener('change', (event) => { state.minConfidence = Number(event.target.value); renderAll(); });
  refs.sortSelect.addEventListener('change', (event) => { state.sort = event.target.value; renderAll(); });
  refs.resetFilters.addEventListener('click', () => {
    state.search = '';
    state.minScore = 0;
    state.minSafety = 'any';
    state.country = 'all';
    state.minConfidence = 0;
    state.sort = 'score-desc';
    refs.searchInput.value = '';
    refs.minScore.value = '0';
    refs.minScoreValue.textContent = 'Any';
    refs.safetyFilter.value = 'any';
    refs.countryFilter.value = 'all';
    refs.confidenceFilter.value = '0';
    refs.sortSelect.value = 'score-desc';
    renderAll();
  });

  renderMethodology();
  renderAll();
})();
