// One-time scraper proxy (AEA + C4C sites) for importing campaign stats.
// DELETE after use. Restricted to the org's own domains.
module.exports = async (req, res) => {
  const target = req.query && req.query.url;
  if (!target || typeof target !== 'string') return res.status(400).json({ error: 'missing url' });
  if (!/^https:\/\/([a-z0-9-]+\.)?(affordableenergy\.org\.au|coalitionforconservation\.com\.au)\//i.test(target)) {
    return res.status(400).json({ error: 'host not allowed' });
  }
  try {
    const r = await fetch(target, { headers: { 'User-Agent': 'C4C-Importer/1.0' }, redirect: 'follow' });
    const body = await r.text();
    res.setHeader('Content-Type', r.headers.get('content-type') || 'text/html; charset=utf-8');
    res.status(r.status).send(body);
  } catch (e) {
    res.status(502).json({ error: String(e && e.message || e) });
  }
};
