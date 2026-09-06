(() => {
  'use strict';
  const data = window.FLATS_DATA;
  const $ = id => document.getElementById(id);
  const escape = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const known = v => v !== null && v !== undefined && v !== '';
  const show = v => known(v) ? escape(v) : 'Unknown';
  const money = v => known(v) ? new Intl.NumberFormat('en-GB', {style:'currency', currency:'GBP', maximumFractionDigits:0}).format(v) : 'Unknown';
  const crimeByLocation = new Map();
  data.crimeResearch.forEach(row => {
    if (!crimeByLocation.has(row.location_id)) crimeByLocation.set(row.location_id, {});
    crimeByLocation.get(row.location_id)[row.category] = row;
  });
  const rate = (location, category) => crimeByLocation.get(location.id)?.[category]?.rate_per_1000;
  function detail(location) {
    const groups = [['buy','Buying: all-flat proxy'],['rent','Renting: modelled one-bedroom LA mean'],['market','Market snapshot'],['localTransport','Local transport'],['nationalTransport','National rail'],['quiet','Quiet'],['condition','Local condition']];
    const links = data.sources.filter(s => s.location_id === location.id && s.topic !== 'crime');
    const crime = crimeByLocation.get(location.id);
    const crimeDetail = crime ? `<h3>Recorded offences (CSP; Apr 2025–Mar 2026)</h3><p>Rates are per 1,000 mid-2024 residents. They are separate measures, not a safety score; recorded offences are affected by reporting and recording practice.</p><dl>${[['Violence against the person', crime.violence_against_person], ['Sexual offences', crime.sexual_offences]].map(([label, row]) => `<dt>${escape(label)}</dt><dd>${show(row?.rate_per_1000)} per 1,000${row ? ` · ${escape(row.csp_name)} CSP · ${show(row.count)} offences` : ''}</dd>`).join('')}</dl>` : `<h3>Recorded offences</h3><p>Unknown: no reviewed CSP observation is available for this location.</p>`;
    $('details').innerHTML = `<h2>${escape(location.name)}</h2>${crimeDetail}` + groups.map(([key, title]) => `<h3>${title}</h3><dl>${Object.entries(location[key]).map(([k,v]) => `<dt>${escape(k)}</dt><dd>${show(v)}</dd>`).join('')}</dl>`).join('') + `<h3>Source links</h3><ul>${links.map(s => `<li>${escape(s.topic)}: <a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.url)}</a></li>`).join('')}</ul>`;
  }
  function render() {
    const tenure = $('tenure').value;
    const price = l => l[tenure][tenure === 'buy' ? 'proxyMedian' : 'proxyMonthly'];
    const query = $('search').value.toLowerCase();
    const rows = data.locations.filter(l => `${l.name} ${l.localAuthority}`.toLowerCase().includes(query));
    rows.sort((a,b) => {
      let diff = 0;
      if ($('sort').value === 'price') diff = (price(a) ?? Infinity) - (price(b) ?? Infinity);
      if ($('sort').value === 'stock') diff = (b[tenure].oneBedCount ?? -Infinity) - (a[tenure].oneBedCount ?? -Infinity);
      return diff || a.name.localeCompare(b.name);
    });
    $('price-heading').textContent = tenure === 'buy' ? 'All-flat achieved median (£)' : 'One-bed LA modelled mean (£/month)';
    $('count').textContent = `${rows.length} of ${data.locations.length} locations`;
    $('rows').innerHTML = rows.map(l => `<tr><td><button data-id="${escape(l.id)}">${escape(l.name)}</button><small>${escape(l.localAuthority)}</small></td><td>${money(price(l))}${tenure === 'buy' ? `<small>${show(l.buy.transactions)} transactions</small>` : ''}</td><td>${show(l[tenure].oneBedCount)}</td><td>${show(l.nationalTransport.londonMinutes)}</td><td>${show(l.nationalTransport.birminghamMinutes)}</td><td>${show(rate(l, 'violence_against_person'))}</td><td>${show(rate(l, 'sexual_offences'))}</td></tr>`).join('');
    $('rows').querySelectorAll('button').forEach(button => button.addEventListener('click', () => detail(data.locations.find(l => l.id === button.dataset.id))));
  }
  ['search','tenure','sort'].forEach(id => $(id).addEventListener('input', render));
  $('evidence').innerHTML = data.evidence.filter(e => e.workstream !== 'geography_crime' || e.id === 'CRIME-ONS-2026-CSP').map(e => `<h3>${escape(e.title)}</h3><p>${escape(e.dataPeriod)} · Recorded retrieval: ${escape(e.retrievalDate)} · ${escape(e.geography)}</p><p>${escape(e.limitations)}</p>`).join('');
  render();
})();
