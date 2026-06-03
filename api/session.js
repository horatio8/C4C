const { sessionFromReq } = require('../lib/auth');

module.exports = (req, res) => {
  const sess = sessionFromReq(req);
  if (!sess || !sess.sub) return res.status(200).json({ admin: false });
  return res.status(200).json({ admin: true, username: sess.sub });
};
