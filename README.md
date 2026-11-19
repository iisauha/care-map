# Care Map NYC

Where to get care cheaply in NYC on the NYCE PPO, plus DC 37 benefits in plain English. Installable PWA, works offline.

Not affiliated with DC 37, NYC, or any health plan. Always confirm coverage before a visit.

## Files
- `index.html`: home is a fixed one-screen map with category chips and a nearest-place card; the menu holds the other views (hash routes `#sick #now #er #teeth #eyes #rx #more #forms #words #cards #settings`).
- `assets/app.css`: tokens and components. PWA sizing, safe areas, scroller, app bar and sheet follow the NYC DEP Dashboard.
- `assets/app.js`: app logic. Leaflet loads only when Map is opened.
- `data.js`: `window.CARE`, `window.OPTICAL`, `window.ZIPS`.
- `sw.js`: offline cache that always prefers the network and skips GitHub Pages' 10-minute cache.
- `version.json`: current version; the app checks it on launch and on resume and reloads when it changes.
- `tools/bump.py`: run `python3 tools/bump.py` before every commit that changes the app. It updates the version in version.json, sw.js, app.js and the `?v=` tags in index.html.

## Rules
- Public repo: no personal details or API keys. Location is used live and never stored.
- Plain, question-based language. No emojis. No em dashes.
