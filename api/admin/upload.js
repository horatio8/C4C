// Admin-gated image upload to GitHub. Body: { filename, contentBase64 }.
// Image is committed to assets/imported/<hash>-<filename>, returns same-origin URL.
const crypto = require('crypto');
const { requireAdmin, readJsonBody } = require('../../lib/auth');
const gh = require('../../lib/github');

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_EXT = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];

module.exports = async (req, res) => {
  const sess = requireAdmin(req, res);
  if (!sess) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }

  let body;
  try { body = await readJsonBody(req); } catch { return res.status(400).json({ error: 'invalid JSON body' }); }
  const { filename, contentBase64 } = body || {};
  if (!filename || !contentBase64) return res.status(400).json({ error: 'missing filename or contentBase64' });

  const ext = String(filename).split('.').pop().toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) return res.status(400).json({ error: `extension '${ext}' not allowed` });

  let buf;
  try { buf = Buffer.from(String(contentBase64).replace(/^data:[^;]+;base64,/, ''), 'base64'); }
  catch { return res.status(400).json({ error: 'invalid base64' }); }
  if (buf.length > MAX_BYTES) return res.status(413).json({ error: `image too large (${buf.length} bytes; max ${MAX_BYTES})` });
  if (buf.length === 0) return res.status(400).json({ error: 'empty image' });

  const hash = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 16);
  const safeName = String(filename).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64) || `img.${ext}`;
  const path = `assets/imported/${hash}-${safeName}`;
  const publicUrl = `/${path}`;

  try {
    // skip the write if a file with this hash+name already exists
    const existing = await gh.getFile(path);
    if (!existing) {
      await gh.putFile(path, buf, `cms: upload ${safeName} (${sess.sub})`);
    }
    return res.status(200).json({ ok: true, url: publicUrl, bytes: buf.length });
  } catch (e) {
    const status = e.code === 'CONFIG' ? 503 : 500;
    return res.status(status).json({ error: e.message });
  }
};
