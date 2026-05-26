// TEMPORARY: returns base64 of banner #i from the manifest so the bytes can
// be pulled into the repo and committed permanently. DELETE after use.
const fs = require('fs');
const path = require('path');
module.exports = async (req, res) => {
  const i = parseInt((req.query && req.query.i) || '', 10);
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scripts', 'canva-banners.json'), 'utf8'));
  const b = manifest.banners[i];
  if (!b) return res.status(400).json({ error: 'bad index' });
  try {
    const r = await fetch(b.url);
    if (!r.ok) return res.status(502).json({ error: 'HTTP ' + r.status });
    const buf = Buffer.from(await r.arrayBuffer());
    res.json({ name: b.name, bytes: buf.length, b64: buf.toString('base64') });
  } catch (e) {
    res.status(502).json({ error: String(e && e.message || e) });
  }
};
