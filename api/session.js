// Vercel deploys are stateless — admin auth requires a Node-hosted backend
// (see README). Always reports unauthenticated so the admin UI shows the
// login screen rather than a half-broken editor.
module.exports = (req, res) => {
  return res.status(200).json({ admin: false });
};
