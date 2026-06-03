const { clearSessionCookie } = require('../lib/auth');

module.exports = (req, res) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'POST, GET');
    return res.status(405).json({ error: 'method not allowed' });
  }
  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
};
