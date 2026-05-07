module.exports = (req, res) => {
  return res.status(503).json({
    error:
      'Admin write is unavailable on this deployment. The CMS requires a Node-hosted backend with a writable filesystem and persistent sessions (e.g. Render, Railway, Fly.io). Run `node server.js` locally to edit content.',
  });
};
