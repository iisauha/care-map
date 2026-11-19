# Health Map NYC

Where to get care cheaply in NYC on the NYCE PPO, plus DC 37 benefits in plain English. Installable PWA, works offline.

Not affiliated with DC 37, NYC, or any health plan. Always confirm coverage before a visit.

## Files
- `index.html`: home is a fixed one-screen map with category chips and a nearest-place card; the menu holds the other views (hash routes `#sick #now #er #teeth #eyes #rx #more #forms #words #cards #settings`).
- `assets/app.css`: tokens and components. PWA sizing, safe areas, scroller, app bar and sheet follow the NYC DEP Dashboard.
- `assets/app.js`: app logic. Leaflet loads only when Map is opened.
- `data.js`: `window.CARE`, `window.OPTICAL`, `window.ZIPS`.
- `sw.js`: network-first offline cache. Bump `CACHE` (and `VERSION` in app.js) on every change.

## Rules
- Public repo: no personal details or API keys. Location is used live and never stored.
- Plain, question-based language. No emojis. No em dashes.
