/* Offline support. Network first, so a new version shows up right away when online;
   falls back to the cached copy when offline. Bump CACHE on every change.
   Only the app shell is cached here. Map tiles stay in the browser's own HTTP cache so a day
   of panning around NYC can't fill the quota and get the shell evicted. */
const CACHE = 'care-v41';
const SHELL = [
  './', './index.html', './manifest.webmanifest', './assets/app.css', './assets/app.js', './data.js',
  './vendor/leaflet/leaflet.css', './vendor/leaflet/leaflet.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const res = await fetch(req, { cache: 'no-cache' });
      if (res.ok) cache.put(req, res.clone());
      return res;
    } catch (err) {
      return (await cache.match(req, { ignoreSearch: true }))
        || (req.mode === 'navigate' && await cache.match('./index.html'))
        || Response.error();
    }
  })());
});
