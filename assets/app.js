(() => {
'use strict';
const VERSION = 'care-v50';
const KEY = 'caremap.v1';
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const enc = encodeURIComponent;

/* ---------- saved settings (this phone only) ---------- */
function load() {
  let s = {};
  try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  // one-time move from the old app's keys; the old saved location is dropped, never migrated
  try {
    const oldCards = localStorage.getItem('cm-cards');
    if (oldCards && !s.cards) s.cards = oldCards;
    if (localStorage.getItem('cm-loc') === '1' && s.loc == null) s.loc = true;
    ['cm-cards', 'cm-loc', 'cm-me'].forEach(k => localStorage.removeItem(k));
  } catch (e) {}
  return Object.assign({ theme: 'light', loc: false, cards: '' }, s);
}
const S = load();
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { snack('Could not save on this phone'); } };
persist();

/* ---------- icons ---------- */
const I = {
  chev: '<svg class="chev" viewBox="0 0 8 13" aria-hidden="true"><path d="M1 1l5.5 5.5L1 12" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  loc: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 3L3 10.5l7.5 3 3 7.5z"/></svg>',
  thermo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 9v7"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.5v.01"/></svg>',
  pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="M9.5 9.5l5 5"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/></svg>',
  tooth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 5.5C10 3.5 5 3 5 8c0 3 1 4.5 1.5 7.5S8 21 9 21s1.2-5 3-5 2 5 3 5 1.9-2.5 2.5-5.5S19 11 19 8c0-5-5-4.5-7-2.5z"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.6v.6M12 17v.01"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 10h18M7 15h4"/></svg>',
  form: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 16V11l2-5h10l2 5v5zM5 16v2M19 16v2"/><circle cx="8.5" cy="13" r=".8" fill="currentColor"/><circle cx="15.5" cy="13" r=".8" fill="currentColor"/></svg>',
  train: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="6" y="3" width="12" height="14" rx="3"/><path d="M6 11h12M9 21l1.5-4M15 21l-1.5-4"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2.2"/><circle cx="8" cy="17" r="2.2"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>'
};
const fillIcons = root => root.querySelectorAll('[data-i]').forEach(e => {
  if (e.dataset.i === 'chev') e.outerHTML = I.chev; else { e.innerHTML = I[e.dataset.i] || ''; e.removeAttribute('data-i'); }
});
fillIcons(document);

/* ---------- data ---------- */
const KIND = {
  acp: { short: 'ACPNY', cost: 0, badge: '$0', label: 'Free sick visit', col: 'free', org: 'AdvantageCare Physicians (ACPNY)', ph: '646-680-4227', how: 'Call to book a same-day sick visit. Not a walk-in.', about: "A big group of doctors' offices. Your plan makes visits here free." },
  gh: { short: 'NYC H+H', cost: 0, badge: '$0', label: 'Free sick visit', col: 'free', org: 'NYC Health + Hospitals clinic', ph: '844-692-4692', how: 'Call to book a same-day sick visit. Not a walk-in.', about: 'A neighborhood clinic run by the City. Free sick visits for you.' },
  uc25: { short: 'NYC H+H', cost: 25, badge: '$25', label: '$25 walk-in', col: 'low', org: 'NYC Health + Hospitals urgent care', ph: '718-883-2273', how: 'Walk in, no appointment.', about: "The City's walk-in urgent care. Cheapest place to walk in." },
  uc50: { short: 'GoHealth', cost: 50, badge: '$50', label: '$50 walk-in', col: 'low', org: 'Northwell GoHealth urgent care', how: 'Walk in. Call first to confirm they take NYCE PPO.', about: 'A walk-in urgent care chain run with Northwell hospitals.' },
  uc100: { short: 'CityMD', cost: 100, badge: '$100', label: '$100 walk-in', col: 'mid', org: 'CityMD urgent care', how: 'Walk in, no appointment. Covered, but your plan charges $100 here.', about: 'A big walk-in urgent care chain. Your plan charges more here.' },
  hosp: { short: 'City hospital', cost: 150, badge: 'ER', label: 'ER $150', col: 'er', org: 'NYC Health + Hospitals hospital', ph: '844-692-4692', how: 'The ER is open 24/7. The $150 is waived if you are admitted, and the stay is $0.', about: 'A City public hospital. If you get admitted, the stay is free.' },
  hosp2: { short: 'Hospital', cost: 150, badge: 'ER', label: 'ER $150', col: 'er', org: 'Hospital', how: 'The ER is open 24/7. A hospital stay here is $300.', about: 'A private hospital. The ER costs the same as anywhere.' },
  dent: { short: 'Dentist', cost: 0, icon: 'tooth', label: 'Dentist', col: 'dent', org: 'Dentist', how: 'Call to book. Ask: "Do you take Delta Dental NY Select for DC 37?"' },
  opt: { short: 'Optical store', cost: 0, icon: 'eye', label: 'Takes voucher', col: 'opt', org: 'Optical store', how: 'Call first to make sure they still take DC 37 vouchers. The map pin is approximate.' }
};
const fmtPh = p => String(p || '').replace(/[^\d]/g, '').replace(/^1?(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
const P = window.CARE.map((r, i) => ({ ...r, i, n: r.n.replace(/^H\+H /, 'NYC H+H ').replace(/^Gotham Health /, 'NYC H+H Gotham Health ') }));
(window.OPTICAL || []).forEach(o => {
  if (o.la == null) return;
  P.push({ k: 'opt', b: o.b, n: o.n, a: o.a, la: o.la, ln: o.ln, h: 'Call for hours', r: null, c: null, ph: fmtPh(o.p), i: P.length });
});
const redd = r => r.net === 'reddit' || (r.why && /Reddit|forum/.test(r.why));
const score = r => r.r == null ? 3 : (r.r * (r.c || 0) + 3.8 * 40) / ((r.c || 0) + 40); // ratings pulled toward 3.8 when there are few reviews
const netLabel = r => r.net === 'yes' ? 'Takes DC 37' : r.net === 'reddit' ? 'Member says it takes DC 37' : 'Ask if they take DC 37';
const tag = r => r.k === 'dent' ? netLabel(r) : KIND[r.k].label;
const tagClass = r => r.k === 'dent' ? (r.net === 'no' ? 'counted' : 'now') : r.k === 'opt' ? 'now' : ({ free: 'now', low: 'low', mid: 'mid', er: 'er' })[KIND[r.k].col];

const CAT = {
  sick: {
    title: "I'm sick", sub: 'See a doctor for $0. Call and ask for a same-day sick visit.', kinds: ['acp', 'gh'],
    top: `<div class="actions"><a class="btn" href="tel:6466804227">Call ACPNY<small>646-680-4227</small></a><a class="btn secondary" href="tel:8446924692">Call NYC H+H<small>844-692-4692</small></a></div>
      <p class="section-foot">Need a work note? Ask before you leave. Can't get in today? <a href="#now">Walk in</a> or use Teladoc, a $10 video visit.</p>`,
    foot: 'These are booked visits, not walk-ins. Call the number for the office or use the main line above.'
  },
  now: { title: 'Walk in today', sub: 'No appointment needed. Cheapest is NYC H+H at $25, then GoHealth at $50 and CityMD at $100.', kinds: ['uc25', 'uc50', 'uc100'],
    foot: 'GoHealth network status for NYCE PPO is not confirmed. Call first.' },
  er: {
    title: 'Emergency', sub: '$150 at any ER. If you are admitted to a City hospital, the stay is $0.', kinds: ['hosp', 'hosp2'],
    top: `<div class="alert"><b>Life-threatening? Call 911 first.</b>Chest pain, trouble breathing, heavy bleeding, a bad fall, or someone who won't wake up. Don't drive yourself.</div>`
  },
  teeth: {
    title: 'Dentist', sub: 'Up to $1,700 a year through Delta Dental. Call first and ask: "Do you take Delta Dental for DC 37?"', kinds: ['dent'],
    top: '<div class="actions one"><a class="btn secondary" href="https://www.deltadentalins.com/dc37" target="_blank" rel="noopener">Find more on Delta Dental</a></div>',
    foot: 'Only the DC 37 Health Center is confirmed in network. Others are member and review picks. Group number 20970.'
  },
  eyes: {
    title: 'Glasses', sub: 'Every 2 years: a free voucher, or $250 back.', kinds: ['opt'], boroughs: true,
    top: `<div class="actions"><a class="btn" href="tel:2128151234">Get a voucher<small>212-815-1234</small></a><a class="btn secondary" href="https://www.dc37.net/app/uploads/2026/11/hs-optical-benefit-reimb.-form-new-update-3-pdf.pdf" target="_blank" rel="noopener">Get $250 back<small>Mail a form</small></a></div>`,
    foot: 'These stores take the DC 37 voucher. The list changes monthly, so call first. Distances and pins are approximate.'
  }
};
const FILTERS = [['all', 'All'], ['top', 'Top rated'], ['reddit', 'Reddit picks']];
const BOROUGHS = ['All', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
const filt = {}, shown = {};

/* ---------- location (live only, never stored) ---------- */
let me = null, locDenied = false, locating = false;
function mi(a, b, c, d) { const R = 3958.8, t = Math.PI / 180, x = Math.sin((c - a) * t / 2) ** 2 + Math.cos(a * t) * Math.cos(c * t) * Math.sin((d - b) * t / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); }
let centerNext = false;
function centerOnMe() {
  if (me && map) { map.stop(); map.flyTo(me, Math.max(map.getZoom(), 14), { duration: .5 }); }
  else centerNext = true;
  locate(!!me);
}
function locate(quiet) {
  if (!navigator.geolocation || locating) return;
  locating = true; if (!quiet) refreshNear();
  navigator.geolocation.getCurrentPosition(p => {
    locating = false; locDenied = false;
    me = [p.coords.latitude, p.coords.longitude];
    if (!S.loc) { S.loc = true; persist(); }
    onLocation();
  }, () => {
    locating = false;
    if (!quiet) { locDenied = true; if (view === 'home') snack('Location is off. Turn it on in iPhone Settings, Privacy, Location Services.'); }
    refreshNear(); if (view === 'places') renderList(); if (view === 'settings') renderSettings();
  }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 });
}
function onLocation() {
  P.forEach(r => r.d = mi(me[0], me[1], r.la, r.ln));
  refreshNear();
  if (view === 'home') renderHome();
  if (view === 'places') { renderList(); if (mapOn) drawPins(true); }
  if (view === 'settings') renderSettings();
}
function refreshNear() {
  const b = $('nearBtn'); if (!b) return;
  b.classList.toggle('on', !!me);
  $('nearLabel').textContent = locating ? 'Finding you' : me ? 'Nearest first' : 'Near me';
}
const dist = r => r.d == null ? '' : (r.k === 'opt' ? '~' : '') + Math.max(.1, r.d).toFixed(1) + ' mi';

/* ---------- navigation ---------- */
const VIEWS = ['home', 'places', 'rx', 'more', 'forms', 'words', 'cards', 'settings'];
let view = 'home', cat = null;
function route() {
  const h = location.hash.slice(1);
  cat = CAT[h] ? h : null;
  view = cat ? 'places' : VIEWS.includes(h) && h !== 'places' ? h : 'home';
  for (const v of VIEWS) $('view-' + v).hidden = v !== view;
  document.body.classList.toggle('on-home', view === 'home');
  $('backBtn').hidden = view === 'home';
  $('settingsBtn').hidden = true;
  $('barTitle').textContent = cat ? CAT[cat].title : $('view-' + view).dataset.title;
  closeSheet(true);
  const el = $('view-' + view);
  if (view !== 'home') { el.classList.remove('view-enter'); void el.offsetWidth; el.classList.add('view-enter'); }
  $('scroller').scrollTop = 0; $('appbar').classList.remove('scrolled');
  ({ home: renderHome, places: renderPlaces, cards: renderCards, settings: renderSettings })[view]?.();
}
window.addEventListener('hashchange', route);
$('settingsBtn').addEventListener('click', () => { location.hash = 'settings'; });
$('backBtn').addEventListener('click', () => { history.replaceState(null, '', location.pathname); route(); });
$('scroller').addEventListener('scroll', () => $('appbar').classList.toggle('scrolled', $('scroller').scrollTop > 40), { passive: true });

/* ---------- segmented controls with a sliding thumb ---------- */
function placeThumb(group) {
  const on = group.querySelector('button[aria-pressed="true"]'), th = group.querySelector('.thumb');
  if (!on || !th || !group.offsetWidth) return;
  th.style.width = on.offsetWidth + 'px';
  th.style.transform = `translateX(${on.offsetLeft - 4}px)`;
}
function pressOne(group, btn) { group.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === btn)); placeThumb(group); }
window.addEventListener('resize', () => document.querySelectorAll('.segmented').forEach(placeThumb));

/* ---------- theme ---------- */
const isDark = () => S.theme === 'dark' || (S.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
function applyTheme() {
  const dark = isDark();
  document.documentElement.dataset.theme = S.theme;
  document.documentElement.classList.toggle('dark', dark);
  const tc = $('themeColor'); if (tc) tc.content = dark ? '#151b18' : '#f1f5ef';
  const sb = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (sb) sb.content = dark ? 'black-translucent' : 'default';
  const g = $('themeToggle');
  g.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x.dataset.theme === S.theme));
  placeThumb(g);
}
$('themeToggle').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  S.theme = b.dataset.theme; persist(); applyTheme(); if (map) drawPins(true);
  if (navigator.standalone) snack('Close and reopen the app to update the top bar');
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

/* ---------- home (the map) ---------- */
const HOME = {
  sick: { chip: "I'm sick", line: '$0 doctor. Call to book a same-day sick visit.' },
  now: { chip: 'Walk in', line: 'No appointment. $25 at NYC H+H, up to $100 at CityMD.' },
  er: { chip: 'Emergency', line: 'Life-threatening? Call 911 first. Any ER is $150.', er: true },
  teeth: { chip: 'Dentist', line: 'Up to $1,700 a year. Call first and ask if they take DC 37.' },
  eyes: { chip: 'Glasses', line: 'Free voucher every 2 years. Call DC 37 at 212-815-1234.' }
};
let homeCat = CAT[S.homeCat] ? S.homeCat : 'sick';
const CHIPCOL = { sick: 'free', now: 'low', er: 'er', teeth: 'dent', eyes: 'opt' };
$('homeChips').innerHTML = Object.entries(HOME).map(([k, v]) =>
  `<button class="chip" data-cat="${k}" aria-pressed="${k === homeCat}"><i style="background:var(--${CHIPCOL[k]})"></i>${v.chip}</button>`).join('');
$('homeChips').addEventListener('click', e => {
  const b = e.target.closest('[data-cat]'); if (!b) return;
  homeCat = b.dataset.cat; S.homeCat = homeCat; persist();
  $('homeChips').querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b));
  b.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
  renderHome();
});
function placeCard(r) {
  const k = KIND[r.k], ph = r.ph || k.ph;
  const bits = [esc(tag(r))]; if (r.r != null) bits.push(r.r.toFixed(1) + ' stars'); else if (r.k === 'opt') bits.push(esc(r.b));
  return `<article class="pcard" data-pid="${r.i}">
    <div class="pc-top">${badge(r)}<div class="pc-main"><h3>${esc(r.n)}</h3>
      <div class="pc-sub">${bits.map((x, i) => i ? `<span class="dot-sep"></span>${x}` : x).join('')}</div></div>
      ${r.d != null ? `<div class="pc-dist">${dist(r)}</div>` : ''}</div>
    <div class="pc-actions"><a class="pri" href="${dirs(r)}" target="_blank" rel="noopener">${I.car}Directions</a>
      ${ph ? `<a href="tel:${ph.replace(/\D/g, '')}">${I.phone}Call</a>` : `<a href="${dirs(r, true)}" target="_blank" rel="noopener">${I.train}Transit</a>`}</div>
  </article>`;
}
function renderHome() {
  const h = HOME[homeCat], l = listFor(homeCat), top = l.slice(0, 8);
  $('homeCard').innerHTML = `<p class="hc-line${h.er ? ' er' : ''}">${esc(h.line)}</p>
    <div class="pcards" id="pcards">${top.map(placeCard).join('')}
      <a class="pcard pc-all" href="#${homeCat}"><b>See all ${l.length}</b><span>${me ? 'Nearest first' : 'As a list'}</span>${I.chev}</a></div>
    <div class="pc-count" id="pcCount" aria-live="polite"></div>`;
  const car = $('pcards'), count = $('pcCount');
  const at = () => Math.round(car.scrollLeft / (car.firstElementChild.offsetWidth + parseFloat(getComputedStyle(car).columnGap || 0)));
  const showCount = i => {
    count.innerHTML = i >= top.length ? `<span>See all ${l.length}</span>`
      : `<span>${i + 1} of ${top.length}</span><span class="bar"><i style="width:${(i + 1) / top.length * 100}%"></i></span>`;
  };
  showCount(0);
  let t = 0;
  car.addEventListener('scroll', () => {
    showCount(at());
    clearTimeout(t); t = setTimeout(() => {
      const i = at(), r = top[i];
      if (r && map) { selectPin(r.i); if (!map.getBounds().pad(-.15).contains([r.la, r.ln])) map.panTo([r.la, r.ln]); }
      else selectPin(-1);
    }, 120);
  }, { passive: true });
  showHomeMap();
}
$('homeCard').addEventListener('click', e => {
  if (e.target.closest('a')) return;
  const r = e.target.closest('[data-pid]'); if (r) openPlace(+r.dataset.pid);
});
$('homeLocate').addEventListener('click', centerOnMe);
function menu() {
  const tile = (href, icon, t) => `<a class="tile" href="#${href}">${I[icon]}<span>${t}</span></a>`;
  openSheet('Menu', `<div class="tiles">
    ${tile('rx', 'pill', 'Prescriptions')}${tile('cards', 'card', 'Insurance cards')}
    ${tile('forms', 'form', 'Forms')}${tile('more', 'phone', 'Other help')}
    ${tile('words', 'help', 'What words mean')}${tile('settings', 'gear', 'Settings')}
  </div><p class="foot" style="margin-top:14px">Not affiliated with DC 37, NYC, or any health plan. Always confirm coverage before a visit.</p>`);
}
$('menuBtn').addEventListener('click', menu);

/* ---------- places ---------- */
function listFor(key) {
  const c = CAT[key], f = filt[key] || 'all';
  let l = P.filter(r => c.kinds.includes(r.k));
  if (c.boroughs) { if (f !== 'all') l = l.filter(r => r.b === f); }
  else if (f === 'top') l = l.filter(r => r.r != null && r.r >= 4.5);
  else if (f === 'reddit') l = l.filter(redd);
  if (me) return l.sort((a, b) => a.d - b.d);
  if (key === 'eyes') return l.sort((a, b) => a.b.localeCompare(b.b) || a.n.localeCompare(b.n));
  if (key === 'teeth') { const o = { yes: 0, reddit: 1, no: 2 }; return l.sort((a, b) => o[a.net] - o[b.net] || score(b) - score(a)); }
  return l.sort((a, b) => KIND[a.k].cost - KIND[b.k].cost || score(b) - score(a));
}
function badge(r) {
  const k = KIND[r.k];
  return k.icon ? `<span class="badge-icon ${k.col}">${I[k.icon]}</span>` : `<span class="badge-icon cost ${k.col}">${k.badge}</span>`;
}
function rowHTML(r) {
  const bits = [esc(tag(r))];
  if (r.k === 'opt') bits.push(esc(r.b)); else if (r.r != null) bits.push(r.r.toFixed(1) + ' stars');
  if (redd(r) && r.k !== 'dent') bits.push('Reddit pick');
  return `<button class="row" data-pid="${r.i}">${badge(r)}<div class="row-main"><div class="row-title">${esc(r.n)}</div>
    <div class="row-sub">${bits.map((b, i) => i ? `<span class="dot-sep"></span>${b}` : b).join('')}</div></div>
    ${r.d != null ? `<div class="row-value dist">${dist(r)}</div>` : ''}${I.chev}</button>`;
}
function renderPlaces() {
  const c = CAT[cat];
  $('plTitle').textContent = c.title; $('plSub').textContent = c.sub;
  $('plTop').innerHTML = c.top || '';
  $('plFoot').textContent = c.foot || '';
  const opts = c.boroughs ? BOROUGHS.map(b => [b === 'All' ? 'all' : b, b]) : FILTERS;
  const f = filt[cat] || 'all';
  $('plChips').innerHTML = opts.map(([v, t]) => `<button class="chip" data-filt="${esc(v)}" aria-pressed="${v === f}">${t}</button>`).join('');
  pressOne($('modeToggle'), $('modeToggle').querySelector(`[data-mode="${mapOn ? 'map' : 'list'}"]`));
  refreshNear();
  renderList();
  showMode();
}
function renderList() {
  const l = listFor(cat), n = shown[cat] || 8, f = filt[cat] || 'all';
  const note = $('locNote');
  note.hidden = !locDenied || !!me;
  note.textContent = 'Location is off, so this list is not sorted by distance. To turn it on: iPhone Settings, Privacy, Location Services, Safari Websites (or Care Map), While Using.';
  if (!l.length) {
    $('plList').innerHTML = `<p class="locnote" style="padding:12px 0">${f === 'reddit' ? 'No Reddit picks for this yet.' : 'Nothing matches.'} <a href="#" data-filt="all">Show all</a></p>`;
  } else {
    $('plList').innerHTML = `<div class="list">${l.slice(0, n).map(rowHTML).join('')}${l.length > n ? `<button class="row action" data-more>Show ${Math.min(20, l.length - n)} more</button>` : ''}</div>`;
  }
  if (mapOn) drawPins();
}
$('plChips').addEventListener('click', e => {
  const b = e.target.closest('[data-filt]'); if (!b) return;
  filt[cat] = b.dataset.filt; shown[cat] = 8;
  $('plChips').querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === b));
  renderList(); if (mapOn) fitPins();
});
$('plList').addEventListener('click', e => {
  if (e.target.closest('[data-more]')) { shown[cat] = (shown[cat] || 8) + 20; renderList(); return; }
  const a = e.target.closest('[data-filt]'); if (a) { e.preventDefault(); filt[cat] = 'all'; renderPlaces(); return; }
  const r = e.target.closest('[data-pid]'); if (r) openPlace(+r.dataset.pid);
});
$('nearBtn').addEventListener('click', () => locate(false));
$('mapLocate').addEventListener('click', centerOnMe);

/* ---------- map (Leaflet, loaded the first time it's needed) ---------- */
let mapOn = false, map = null, mapHost = null, layer = null, meMk = null, leaflet = null, pinKey = '';
const markers = {};
function loadLeaflet() {
  if (window.L) return Promise.resolve();
  return leaflet || (leaflet = new Promise((ok, no) => {
    const s = document.createElement('script'); s.src = 'vendor/leaflet/leaflet.js?v=' + VERSION; s.onload = ok; s.onerror = no; document.head.appendChild(s);
  }));
}
$('modeToggle').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  mapOn = b.dataset.mode === 'map'; pressOne($('modeToggle'), b); showMode();
});
const mcat = () => view === 'home' ? homeCat : cat;
function mountMap(host, extra) {
  return loadLeaflet().then(() => {
    if (mapHost !== host) { host.prepend($('map')); mapHost = host; }
    if (!map) initMap();
    map.invalidateSize({ pan: false });
    drawPins(true);
  }).catch(() => { $('map').innerHTML = '<p class="locnote" style="padding:16px">The map could not load. Try again when you are online.</p>'; });
}
function showHomeMap() { mountMap($('homeMap')); }
function showMode() {
  $('plList').hidden = mapOn; $('mapBox').hidden = !mapOn;
  // In map mode the intro buttons step aside so the map gets the screen
  $('plTop').querySelectorAll('.actions, .section-foot').forEach(e => e.hidden = mapOn); $('plFoot').hidden = mapOn;
  if (!mapOn) return;
  mountMap($('mapBox'));
}
function initMap() {
  map = L.map('map', { zoomControl: false, attributionControl: true, zoomSnap: .25, tap: false }).setView([40.705, -73.93], 11);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>' }).addTo(map);
  map.attributionControl.setPrefix(false);
  layer = L.layerGroup().addTo(map);
  // A standalone PWA can report the box's final size a beat late (status bar and safe area settling).
  // Window resize doesn't fire for that, so watch the element itself, like the old app did.
  if (window.ResizeObserver) {
    let w = 0, h = 0;
    new ResizeObserver(([e]) => { const r = e.contentRect; if (r.width < 2 || (Math.abs(r.width - w) < 2 && Math.abs(r.height - h) < 2)) return; w = r.width; h = r.height; map.invalidateSize({ pan: false }); }).observe($('map'));
  }
}
function pinColor(r) { return getComputedStyle(document.documentElement).getPropertyValue('--' + KIND[r.k].col).trim(); }
function drawPins(force) {
  const c = mcat(); if (!map || !c) return;
  const l = listFor(c), key = c + ':' + (filt[c] || 'all') + ':' + !!me + ':' + isDark() + ':' + view;
  if (!force && key === pinKey) return;
  const changed = key !== pinKey; pinKey = key;
  layer.clearLayers();
  l.forEach(r => {
    const m = L.marker([r.la, r.ln], { icon: L.divIcon({ className: '', html: `<div class="pin" style="background:${pinColor(r)}"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] }), keyboard: false, title: r.n });
    m.on('click', () => { openPlace(r.i); const c = view === 'home' && document.querySelector(`#pcards [data-pid="${r.i}"]`); if (c) c.scrollIntoView({ inline: 'start', block: 'nearest' }); }); markers[r.i] = m; layer.addLayer(m);
  });
  if (me) { if (meMk) meMk.setLatLng(me).addTo(map); else meMk = L.marker(me, { icon: L.divIcon({ className: '', html: '<div class="me"></div>', iconSize: [16, 16], iconAnchor: [8, 8] }), interactive: false, zIndexOffset: 2000 }).addTo(map); }
  if (changed || force) fitPins();
  if (centerNext && me) { centerNext = false; map.setView(me, Math.max(map.getZoom(), 14), { animate: false }); }
}
function fitPins(animate) {
  const c = mcat(); if (!map || !c) return;
  const l = listFor(c); if (!l.length) return;
  const pts = me ? [me, ...l.slice(0, 5).map(r => [r.la, r.ln])] : l.map(r => [r.la, r.ln]);
  map.fitBounds(L.latLngBounds(pts), { padding: [36, 36], maxZoom: 15, animate: !!animate });
}
function selectPin(id) {
  Object.entries(markers).forEach(([k, m]) => { const el = m.getElement && m.getElement(); if (el) el.firstChild.classList.toggle('sel', +k === id); m.setZIndexOffset(+k === id ? 1000 : 0); });
}

/* ---------- place sheet ---------- */
const dirs = (r, transit) => `https://www.google.com/maps/dir/?api=1&destination=${enc(r.n + ', ' + r.a)}${transit ? '&travelmode=transit' : ''}`;
function openPlace(id) {
  const r = P.find(x => x.i === id); if (!r) return;
  const k = KIND[r.k], ph = r.ph || k.ph;
  if (map) selectPin(id);
  const call = ph ? `<a href="tel:${ph.replace(/\D/g, '')}">${I.phone}<span>Call</span></a>`
    : `<a href="https://www.google.com/search?q=${enc(r.n + ' ' + r.a)}" target="_blank" rel="noopener">${I.globe}<span>Look up</span></a>`;
  const slides = [
    ['Where and when', `<dl><dt>Address</dt><dd>${esc(r.a.replace(/, NY \d{5}$/, ''))}</dd><dt>Hours</dt><dd>${esc(r.h)}</dd></dl>`],
    ['How to go', `<p>${esc(k.how)}</p>`],
    (r.why || k.about) && [r.why ? 'What people say' : 'About', `<p>${esc(r.why || k.about)}</p>`]
  ].filter(Boolean);
  openSheet(k.short, `
    <h2 class="place-name">${esc(r.n)}</h2>
    <div class="place-meta"><span class="pill ${tagClass(r)}">${esc(tag(r))}</span>
      ${r.r != null ? `<span>${r.r.toFixed(1)} stars (${(r.c || 0).toLocaleString()})</span>` : ''}${r.d != null ? `<span>${dist(r)}</span>` : ''}</div>
    <div class="quick"><a class="pri" href="${dirs(r)}" target="_blank" rel="noopener">${I.car}<span>Directions</span></a>
      <a href="${dirs(r, true)}" target="_blank" rel="noopener">${I.train}<span>Transit</span></a>${call}</div>
    <div class="carousel" id="carousel">${slides.map(([t, h]) => `<section class="slide"><h3>${t}</h3>${h}</section>`).join('')}</div>
    <div class="dots" id="dots">${slides.map((_, i) => `<button aria-label="Card ${i + 1}" aria-current="${i === 0}"></button>`).join('')}</div>`);
  const car = $('carousel'), dots = [...$('dots').children];
  car.addEventListener('scroll', () => {
    const i = Math.round(car.scrollLeft / (car.firstElementChild.offsetWidth + 10));
    dots.forEach((d, j) => d.setAttribute('aria-current', j === i));
  }, { passive: true });
  dots.forEach((d, j) => d.addEventListener('click', () => car.children[j].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })));
}
let lastFocus = null;
function openSheet(title, html) {
  lastFocus = document.activeElement;
  $('sheetTitle').textContent = title;
  $('sheetBody').innerHTML = html;
  $('scrim').hidden = false; $('sheet').hidden = false; $('sheet').scrollTop = 0;
  requestAnimationFrame(() => { $('scrim').classList.add('open'); $('sheet').classList.add('open'); });
  setTimeout(() => $('sheet').focus({ preventScroll: true }), 50);
}
function closeSheet(instant) {
  if ($('sheet').hidden) return;
  $('scrim').classList.remove('open'); $('sheet').classList.remove('open');
  if (map) selectPin(-1);
  const done = () => { if (!$('sheet').classList.contains('open')) { $('scrim').hidden = true; $('sheet').hidden = true; $('sheetBody').replaceChildren(); } };
  if (instant === true) done(); else setTimeout(done, 300);
  lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
}
$('sheetClose').addEventListener('click', closeSheet);
$('scrim').addEventListener('click', closeSheet);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
// swipe the sheet down to close
(() => {
  const sh = $('sheet'); let y0 = null, dy = 0;
  sh.addEventListener('touchstart', e => { y0 = sh.scrollTop <= 0 && !e.target.closest('.carousel') ? e.touches[0].clientY : null; dy = 0; }, { passive: true });
  sh.addEventListener('touchmove', e => {
    if (y0 == null) return; dy = e.touches[0].clientY - y0;
    if (dy > 0 && matchMedia('(max-width: 639px)').matches) { sh.style.transition = 'none'; sh.style.transform = `translateY(${dy}px)`; }
  }, { passive: true });
  sh.addEventListener('touchend', () => {
    if (y0 == null) return; sh.style.transition = ''; sh.style.transform = '';
    if (dy > 90) closeSheet(); y0 = null;
  });
})();

/* ---------- forms and words ---------- */
const FORMS = [
  { t: 'Glasses: $250 back', u: 'https://www.dc37.net/app/uploads/2026/11/hs-optical-benefit-reimb.-form-new-update-3-pdf.pdf' },
  { t: 'Out sick long-term (disability)', d: 'File within 30 days. Fax 212-298-9886.', u: 'https://www.dc37.net/app/uploads/benefits/health/pdf/Disability_ClaimForm.pdf' },
  { t: 'Who gets your life insurance', u: 'https://www.dc37.net/app/uploads/benefits/health/pdf/BeneficiaryForm.pdf' },
  { t: 'Change address or add family', u: 'https://www.dc37.net/app/uploads/benefits/health/pdf/EnrollmentForm2025.pdf' },
  { t: 'Drug approval', d: 'Give this to your doctor.', u: 'https://www.dc37.net/app/uploads/benefits/health/pdf/DC37_Health_and_Security_Prior_Authorization_Request_Form.pdf' }
];
$('formsList').innerHTML = FORMS.map(f => `<a class="row" href="${f.u}" target="_blank" rel="noopener"><div class="row-main"><div class="row-title">${esc(f.t)}</div>${f.d ? `<div class="row-sub">${esc(f.d)}</div>` : ''}</div>${I.chev}</a>`).join('');
const WORDS = [
  ['Copay', 'What you pay at a visit.'], ['In-network', 'Places your insurance works with. Cheap.'], ['Out-of-network', "Places it doesn't. Can be expensive."],
  ['ACPNY', "A big group of doctors' offices. Free for you."], ['NYC H+H', "The City's hospitals and clinics. Also free for you."],
  ['Urgent care', 'A walk-in clinic for things like flu or a sprain.'], ['ER', 'For real emergencies.'], ['Teladoc', 'A doctor on a video call. $10.'],
  ['NYCE PPO', 'Your medical insurance.'], ['DC 37', 'Your union. Covers prescriptions, dental and glasses.'], ['OptumRx', 'Your pharmacy card.'],
  ['Voucher', 'A slip that pays for your glasses.']
];
$('wordsList').innerHTML = WORDS.map(([t, d]) => `<div class="row"><div class="row-main"><div class="row-title">${t}</div><div class="row-sub">${d}</div></div></div>`).join('');

/* ---------- insurance cards link ---------- */
let editingCards = false;
function renderCards() {
  const box = $('cardsBody');
  if (S.cards && !editingCards) {
    box.innerHTML = `<div class="actions one"><a class="btn" href="${esc(S.cards)}" target="_blank" rel="noopener">Open my cards</a></div>
      <div class="list" style="margin-top:12px"><button class="row action" id="cardsEdit">Change link</button><button class="row destructive" id="cardsDel">Remove link</button></div>`;
    $('cardsEdit').onclick = () => { editingCards = true; renderCards(); };
    $('cardsDel').onclick = () => { S.cards = ''; persist(); renderCards(); snack('Link removed'); };
    return;
  }
  box.innerHTML = `<h2 class="section-head">Link</h2>
    <div class="field"><input type="url" id="cardsIn" placeholder="https://drive.google.com/..." autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(S.cards)}" aria-label="Link to your card photos"></div>
    <p class="err" id="cardsErr" hidden>That doesn't look like a link. It should start with https://</p>
    <div class="actions"><button class="btn secondary" id="cardsPaste">Paste</button><button class="btn" id="cardsSave">Save</button></div>
    <p class="section-foot" style="margin-top:16px">In Google Drive: put your card photos in a folder, tap Share, set General access to Restricted, then Copy link. Only your Google account can open it.</p>`;
  $('cardsPaste').onclick = async () => { try { $('cardsIn').value = (await navigator.clipboard.readText()).trim(); } catch (e) { $('cardsIn').focus(); snack('Long-press the box to paste'); } };
  $('cardsSave').onclick = () => {
    const v = $('cardsIn').value.trim();
    if (!/^https:\/\/\S+$/.test(v)) { $('cardsErr').hidden = false; return; }
    S.cards = v; persist(); editingCards = false; renderCards(); snack('Saved on this phone');
  };
}

/* ---------- settings ---------- */
function renderSettings() {
  applyTheme();
  $('locTitle').textContent = me ? 'Location is on' : locating ? 'Finding you' : 'Use my location';
  $('locSub').textContent = me ? 'Lists are sorted by distance. Tap to turn off.' : locDenied ? 'Blocked. Turn it on in iPhone Settings, Privacy, Location Services.' : 'Sort places by distance';
  $('ver').textContent = VERSION.replace('care-', '');
}
$('locRow').addEventListener('click', () => {
  if (me) { me = null; S.loc = false; persist(); P.forEach(r => r.d = null); renderSettings(); snack('Location off'); }
  else { locate(false); renderSettings(); }
});

/* ---------- install / offline ---------- */
let deferred = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; $('installRow').hidden = false; });
$('installRow').addEventListener('click', async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $('installRow').hidden = true; });
if (!(matchMedia('(display-mode: standalone)').matches || navigator.standalone) && /iphone|ipad|ipod/i.test(navigator.userAgent)) $('iosInstallRow').hidden = false;
/* Stay on the newest version. An iPhone Home Screen app usually resumes instead of reloading,
   so check version.json on launch and every time the app comes back to the foreground. */
let swReg = null, checking = false;
async function checkForUpdate() {
  if (checking || !navigator.onLine) return;
  checking = true;
  try {
    const r = await fetch('version.json?_=' + Date.now(), { cache: 'no-store' });
    const { version } = await r.json();
    if (version && version !== VERSION) {
      // Reload at most once per new version, so a lagging CDN edge can't cause a loop
      if (sessionStorage.getItem('cm-reloaded-for') === version) return;
      sessionStorage.setItem('cm-reloaded-for', version);
      if (swReg) { try { await swReg.update(); } catch (e) {} }
      location.reload();
    }
  } catch (e) {} finally { checking = false; }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkForUpdate(); });
window.addEventListener('pageshow', e => { if (e.persisted) checkForUpdate(); });
window.addEventListener('online', checkForUpdate);
if ('serviceWorker' in navigator) {
  const hadController = !!navigator.serviceWorker.controller;
  // updateViaCache 'none': the browser never uses its HTTP cache when checking sw.js for a new version
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(r => { swReg = r; r.update(); }).catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController && !window.__reloaded) { window.__reloaded = true; location.reload(); } });
}

/* ---------- snackbar ---------- */
let snackT = 0;
function snack(text) {
  $('snackText').textContent = text; $('snackbar').classList.add('show');
  clearTimeout(snackT); snackT = setTimeout(() => $('snackbar').classList.remove('show'), 2600);
}

/* ---------- start ---------- */
applyTheme();
route();
checkForUpdate();
if (S.loc) locate(true);
})();
