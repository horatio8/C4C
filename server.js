const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

const CONTENT_PATH = path.join(__dirname, 'content', 'content.json');

function readContent() {
  return JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
}

function writeContent(obj) {
  const tmp = CONTENT_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2));
  fs.renameSync(tmp, CONTENT_PATH);
}

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(session({
  name: 'c4c.sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 },
}));

function requireAuth(req, res, next) {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ error: 'unauthorized' });
}

app.get('/content.js', (req, res) => {
  const content = readContent();
  res.type('application/javascript');
  res.send('window.CONTENT = ' + JSON.stringify(content) + ';');
});

app.get('/api/content', (req, res) => {
  res.json(readContent());
});

app.put('/api/content', requireAuth, (req, res) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'invalid body' });
  }
  writeContent(req.body);
  res.json({ ok: true });
});

app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (typeof password !== 'string') return res.status(400).json({ error: 'missing password' });
  const a = Buffer.from(password);
  const b = Buffer.from(ADMIN_PASSWORD);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) return res.status(401).json({ error: 'wrong password' });
  req.session.admin = true;
  res.json({ ok: true });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/session', (req, res) => {
  res.json({ admin: !!(req.session && req.session.admin) });
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => {
  console.log(`C4C server listening on http://localhost:${PORT}`);
  if (ADMIN_PASSWORD === 'change-me') {
    console.warn('WARNING: ADMIN_PASSWORD is the default. Set the env var before deploying.');
  }
});
