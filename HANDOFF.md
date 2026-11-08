# Care Map: handoff notes

Paste this into a new Claude chat (with GitHub connected) to pick up where we left off.

---

I have a web app in my GitHub repo **iisauha/care-map**, live at **https://iisauha.github.io/care-map/** (GitHub Pages, main branch, root). It's an installable PWA I use on my iPhone from the Home Screen. Please clone the repo and keep working on it.

## What it is
A map-first app for NYC City workers on the **NYCE PPO** health plan who are also **DC 37** members. It shows where to get care cheaply and explains union benefits in plain English.

## Rules for working on it
- **Public repo, no personal details.** Never commit names, addresses, my location, or any API keys. The map uses free OpenStreetMap tiles (no key). "Near me" uses the phone's location live and never stores it.
- **Style:** simple, intuitive, plain language, question-based ("I'm sick", "Walk-in", "Emergency"). No emojis. Less is more. Clean, native-iOS feel; must not look like generic AI output.
- **No em dashes** anywhere in the text.
- Test thoroughly before pushing (I like a headless-browser test pass), and bump the cache version in `sw.js` on every change so the phone picks up updates.

## Files
- `index.html`: the whole app (HTML, CSS, JS in one file).
- `data.js`: `window.CARE` (places), `window.OPTICAL` (DC 37 voucher stores, positions approximate from ZIP centroids), `window.ZIPS` (NYC ZIP centroids).
- `sw.js`: service worker (offline cache). Bump `care-vN` on every change.
- `manifest.webmanifest`, icons, `vendor/leaflet/` (Leaflet 1.9.4, vendored), `robots.txt` (noindex).

## How the app works
- Full-screen Leaflet map with a bottom sheet (like Apple Maps). Sheet snaps: peek / half / full, drag anywhere, velocity flicks, never grows taller than its content, content only scrolls when full. Keyboard slides over the sheet (sheet sized to layout viewport, not visualViewport).
- Top chips: Sick, Walk-in, Emergency, Dentist, More. Each filters the map and list. Filters (All / Top rated / Reddit picks) filter both list and map.
- Tap a place: map glides to center it above the sheet; sheet shows Directions, Subway/Bus, Call.
- Hash routes: `#home #sick #now #er #teeth #more #rx #eyes #forms #words`.

## Place types and costs (from the NYCE PPO benefit summary)
- `acp` ACPNY offices and `gh` NYC H+H Gotham Health clinics: **$0** sick visit (book same-day; not urgent care).
- `uc25` NYC H+H ExpressCare $25, `uc50` Northwell GoHealth $50 (network not confirmed), `uc100` CityMD $100.
- `hosp` NYC H+H hospitals: ER $150, stay $0. `hosp2` other hospitals: ER $150, stay $300.
- `dent` dentists: DC 37 Health Center (confirmed), Sunnyside Dental (a DC 37 member on Reddit said it takes the plan), plus Reddit-recommended and highly rated offices (network not confirmed).
- `opt` DC 37 optical voucher stores, sorted by distance from the user.

## Benefit facts used (DC 37 Health & Security Plan, 212-815-1234)
- Rx (OptumRx): generic $10, preferred brand $20, non-preferred $45.50; mail order 90 days = 2 copays.
- Glasses: voucher, or up to $250 back every 24 months (form + receipts to 125 Barclay St, NY 10007).
- Dental: Delta Dental NY Select, $1,700/yr, group 20970, 1-888-523-3237.
- Hearing 212-791-2126, counseling 212-815-1260, legal (MELS) 212-815-1111.
- Sources: dc37.net/benefits/health/public/ and nyceppo.com benefit summary (UMC0370).

## Ideas not done yet
- Real coordinates for optical stores (currently ZIP-based).
- Confirm GoHealth network status for NYCE PPO.
- More Reddit-sourced picks if good threads turn up.
