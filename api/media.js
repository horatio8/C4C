// GET returns the bundled media catalogue.
// PUT is gated by admin auth in server.js for local dev — on Vercel it
// returns 503 since the filesystem is read-only.
const media = require('../content/media.json');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json(media);
  }
  if (req.method === 'PUT') {
    return res.status(503).json({
      error: 'Media write is unavailable on this deployment. Run `node server.js` locally to edit, then commit & push content/media.json.',
    });
  }
  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'method not allowed' });
};
