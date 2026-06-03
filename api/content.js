// content.json read/write.
// GET (public): returns current content. Tries GitHub first (so the admin UI
//   sees live edits before the next deploy), falls back to the bundled file.
// PUT (admin): commits new content.json to the repo; Vercel auto-redeploys.
const { requireAdmin, readJsonBody } = require('../lib/auth');
const gh = require('../lib/github');
const bundled = require('../content/content.json');

const PATH = 'content/content.json';

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { data } = await gh.getJson(PATH);
      return res.status(200).json(data || bundled);
    } catch {
      return res.status(200).json(bundled);
    }
  }

  if (req.method === 'PUT') {
    const sess = requireAdmin(req, res);
    if (!sess) return;
    let body;
    try { body = await readJsonBody(req); } catch { return res.status(400).json({ error: 'invalid JSON body' }); }
    if (!body || typeof body !== 'object') return res.status(400).json({ error: 'payload must be an object' });
    if (!body.site || !body.home) return res.status(400).json({ error: 'payload missing required top-level keys (site, home)' });
    try {
      await gh.putJson(PATH, body, `cms: update content.json (${sess.sub})`);
      return res.status(200).json({ ok: true });
    } catch (e) {
      const status = e.code === 'CONFIG' ? 503 : 500;
      return res.status(status).json({ error: e.message });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'method not allowed' });
};
