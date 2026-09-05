(() => {
  'use strict';
  const data = window.FLATS_DATA;
  const $ = id => document.getElementById(id);
  const escape = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const known = v => v !== null && v !== undefined && v !== '';
  const show = v => known(v) ? escape(v) : 'Unknown';
  const money = v => known(v) ? new Intl.NumberFormat('en-GB', {style:'currency', currency:'GBP', maximumFractionDigits:0}).format(v) : 'Unknown';
  function detail(location) {
    const groups = [['buy','Buying: all-flat proxy'],['rent','Renting: modelled one-bedroom LA mean'],['market','Market snapshot'],['localTransport','Local transport'],['nationalTransport','National rail'],['quiet','Quiet'],['condition','Local condition']];
    const links = data.sources.filter(s => s.location_id === location.id && s.topic !== 'crime');
    $('details').innerHTML = `<h2>${escape(location.name)}</h2><p>Safety: pending replacement. All assessments below are inherited and unverified.</p>` + groups.map(([key, title]) => `<h3>${title}</h3><dl>${Object.entries(location[key]).map(([k,v]) => `<dt>${escape(k)}</dt><dd>${show(v)}</dd>`).join('')}</dl>`).join('') + `<h3>Recorded source links</h3><ul>${links.map(s => `<li>${escape(s.topic)}: <a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.url)}</a></li>`).join('')}</ul>`;
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
    $('rows').innerHTML = rows.map(l => `<tr><td><button data-id="${escape(l.id)}">${escape(l.name)}</button><small>${escape(l.localAuthority)}</small></td><td>${money(price(l))}${tenure === 'buy' ? `<small>${show(l.buy.transactions)} transactions</small>` : ''}</td><td>${show(l[tenure].oneBedCount)}</td><td>${show(l.nationalTransport.londonMinutes)}</td><td>${show(l.nationalTransport.birminghamMinutes)}</td><td>Pending</td></tr>`).join('');
    $('rows').querySelectorAll('button').forEach(button => button.addEventListener('click', () => detail(data.locations.find(l => l.id === button.dataset.id))));
  }
  ['search','tenure','sort'].forEach(id => $(id).addEventListener('input', render));
  $('evidence').innerHTML = data.evidence.filter(e => e.workstream !== 'geography_crime').map(e => `<h3>${escape(e.title)}</h3><p>${escape(e.dataPeriod)} · Recorded retrieval: ${escape(e.retrievalDate)} · ${escape(e.geography)}</p><p>${escape(e.limitations)}</p>`).join('');
  render();
})();
