// media.json read/write.
// GET (public): live from GitHub if configured, else bundled.
// PUT (admin): replaces entire array; commits + Vercel auto-redeploys.
const { requireAdmin, readJsonBody } = require('../lib/auth');
const gh = require('../lib/github');
const bundled = require('../content/media.json');

const PATH = 'content/media.json';
const REQUIRED = ['id', 'title', 'date', 'type', 'tag'];

function validate(arr) {
  if (!Array.isArray(arr)) return 'payload must be an array';
  const ids = new Set();
  for (let i = 0; i < arr.length; i++) {
    const it = arr[i];
    if (!it || typeof it !== 'object') return `item ${i}: not an object`;
    for (const k of REQUIRED) {
      if (!it[k] || typeof it[k] !== 'string') return `item ${i} (${it.title || '?'}): missing/invalid '${k}'`;
    }
    if (ids.has(it.id)) return `item ${i}: duplicate id '${it.id}'`;
    ids.add(it.id);
  }
  return null;
}

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
    const err = validate(body);
    if (err) return res.status(400).json({ error: err });
    try {
      await gh.putJson(PATH, body, `cms: update media.json (${sess.sub})`);
      return res.status(200).json({ ok: true, count: body.length });
    } catch (e) {
      const status = e.code === 'CONFIG' ? 503 : 500;
      return res.status(status).json({ error: e.message });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'method not allowed' });
};
