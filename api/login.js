const { verifyPassword, signJWT, setSessionCookie, readJsonBody, SESSION_TTL_SECONDS } = require('../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.SESSION_SECRET;
  if (!adminHash || !secret) {
    return res.status(503).json({ error: 'CMS not configured (missing ADMIN_PASSWORD_HASH / SESSION_SECRET env vars).' });
  }
  let body;
  try { body = await readJsonBody(req); } catch { return res.status(400).json({ error: 'invalid JSON body' }); }
  const { username, password } = body || {};
  if (!password) return res.status(400).json({ error: 'missing password' });

  // Username is optional (single-user CMS). If provided, must match.
  const userOk = !username || (typeof username === 'string' && username.toLowerCase() === adminUser.toLowerCase());
  const passOk = verifyPassword(password, adminHash);
  if (!userOk || !passOk) {
    await new Promise(r => setTimeout(r, 300)); // dampen brute force
    return res.status(401).json({ error: 'invalid credentials' });
  }
  const token = signJWT({ sub: adminUser }, secret, SESSION_TTL_SECONDS);
  setSessionCookie(res, token);
  return res.status(200).json({ ok: true, username: adminUser });
};
