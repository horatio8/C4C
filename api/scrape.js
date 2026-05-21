// One-time scraper proxy. Only allows fetches against the legacy C4C
// WordPress site so we can import the media catalogue once. DELETE this
// file after content/media.json is populated.
module.exports = async (req, res) => {
  const target = req.query && req.query.url;
  if (!target || typeof target !== 'string') {
    return res.status(400).json({ error: 'missing url param' });
  }
  if (!/^https:\/\/coalitionforconservation\.com\.au\//i.test(target)) {
    return res.status(400).json({ error: 'host not allowed' });
  }
  try {
    const upstream = await fetch(target, {
      headers: { 'User-Agent': 'C4C-MediaImporter/1.0' },
      redirect: 'follow',
    });
    const body = await upstream.text();
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'text/html; charset=utf-8');
    res.status(upstream.status).send(body);
  } catch (e) {
    res.status(502).json({ error: 'fetch failed', detail: String(e && e.message || e) });
  }
};
