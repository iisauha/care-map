const C='care-v35';
const F=['./','index.html','data.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','vendor/leaflet/leaflet.css','vendor/leaflet/leaflet.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 const sameOrigin=new URL(e.request.url).origin===location.origin;
 // Only the app shell goes in Cache Storage. Map tiles are left to the browser's own HTTP cache so a day of
 // panning around NYC can't fill the quota and get the app shell (what makes the PWA work offline) evicted.
 e.respondWith(fetch(e.request).then(r=>{if(sameOrigin&&r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>sameOrigin?caches.match(e.request).then(r=>r||caches.match('index.html')):Response.error()))});
