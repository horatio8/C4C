// TEMP scraper proxy for importing team profile photos (og:image extraction).
// DELETE after use.
const ALLOWED = /^https:\/\/(?:[a-z0-9-]+\.)*(?:affordableenergy\.org\.au|coalitionforconservation\.com\.au|sasgroup\.net\.au|davidpnixon\.com|minervanetwork\.com\.au|paradice\.com|aip\.asn\.au|parliament\.nsw\.gov\.au|celebrityspeakers\.com\.au|aph\.gov\.au|togetherforhumanity\.org\.au|monash\.edu|weeklytimes\.com\.au|unglobalcompact\.org\.au|investmentmagazine\.com\.au)\//i;

module.exports = async (req, res) => {
  const target = req.query && req.query.url;
  if (!target || typeof target !== 'string') return res.status(400).json({ error: 'missing url' });
  if (!ALLOWED.test(target)) return res.status(400).json({ error: 'host not allowed' });
  try {
    const r = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; C4C-Importer/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });
    const body = await r.text();
    res.setHeader('Content-Type', r.headers.get('content-type') || 'text/html; charset=utf-8');
    res.status(r.status).send(body);
  } catch (e) {
    res.status(502).json({ error: String(e && e.message || e) });
  }
};
