// One-time scraper proxy for the legacy C4C site (about-us team + partner
// logos). DELETE after content is imported. Restricted to the C4C host.
module.exports = async (req, res) => {
  const target = req.query && req.query.url;
  if (!target || typeof target !== 'string') return res.status(400).json({ error: 'missing url' });
  if (!/^https:\/\/coalitionforconservation\.com\.au\//i.test(target)) {
    return res.status(400).json({ error: 'host not allowed' });
  }
  try {
    const upstream = await fetch(target, { headers: { 'User-Agent': 'C4C-Importer/1.0' }, redirect: 'follow' });
    const body = await upstream.text();
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'text/html; charset=utf-8');
    res.status(upstream.status).send(body);
  } catch (e) {
    res.status(502).json({ error: 'fetch failed', detail: String(e && e.message || e) });
  }
};
