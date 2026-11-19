/* Always the newest version, offline still works.
   GitHub Pages sends Cache-Control: max-age=600 on everything and its CDN keeps its own copies, so:
   - the page itself is fetched with a one-off query string, which skips both the browser and CDN caches;
   - every asset URL carries ?v=<version> (set by tools/bump.py), so a new release never mixes with old files;
   - version.json is never cached, the app polls it on launch and on resume and reloads when it changes.
   The cached copies are only used when the network fails. Map tiles are left to the browser's HTTP cache. */
const CACHE = 'care-v50';
const V = '?v=' + CACHE;
const SHELL = [
  './index.html', './manifest.webmanifest', './assets/app.css' + V, './assets/app.js' + V, './data.js' + V,
  './vendor/leaflet/leaflet.css' + V, './vendor/leaflet/leaflet.js' + V,
  './vendor/fonts/atkinson-next-latin.woff2', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'
];
const bust = u => u + (u.includes('?') ? '&' : '?') + '_=' + Date.now();

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => Promise.all(SHELL.map(u => fetch(bust(u), { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error(u); return c.put(u, r); }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.endsWith('/version.json')) { e.respondWith(fetch(bust(req.url), { cache: 'no-store' })); return; }
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const nav = req.mode === 'navigate';
    const key = nav ? './index.html' : req;
    try {
      const res = await fetch(nav ? bust(new URL('./index.html', location).href) : req, { cache: 'no-store' });
      if (res.ok) cache.put(key, res.clone());
      return res;
    } catch (err) {
      return (await cache.match(key)) || (await cache.match(req, { ignoreSearch: true })) || Response.error();
    }
  })());
});
