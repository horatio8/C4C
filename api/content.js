// GET returns the bundled content (read-only). PUT is gated by admin
// auth in server.js for local dev — on Vercel it returns 503 since
// the filesystem is read-only and sessions don't persist across cold starts.
const content = require('../content/content.json');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json(content);
  }
  if (req.method === 'PUT') {
    return res.status(503).json({
      error:
        'Admin write is unavailable on this deployment. The CMS requires a Node-hosted backend with a writable filesystem (e.g. Render, Railway, Fly.io). Run `node server.js` locally to edit content.',
    });
  }
  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'method not allowed' });
};
