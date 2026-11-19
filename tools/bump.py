"""Bump the app version everywhere in one go. Run before every commit that changes the app:
    python3 tools/bump.py
It updates version.json, the service worker cache name, VERSION in app.js and the ?v= tags in index.html,
so a stale CDN copy can never be mixed with a new one."""
import json, re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
vf = root / 'version.json'
old = json.loads(vf.read_text())['version']
new = 'care-v%d' % (int(re.search(r'\d+$', old).group()) + 1)
vf.write_text(json.dumps({'version': new}) + '\n')
for f in ['sw.js', 'assets/app.js', 'index.html']:
    p = root / f
    p.write_text(re.sub(r'care-v\d+', new, p.read_text()))
print(old, '->', new)
