const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_PREVIEW = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';

const ROOT = __dirname;
const CONTENT_PATH = path.join(ROOT, 'content', 'content.json');

function readContent() {
  return JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
}

function writeContent(obj) {
  const tmp = CONTENT_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2));
  fs.renameSync(tmp, CONTENT_PATH);
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));
app.use(session({
  name: 'c4c.sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: IS_PROD, maxAge: 1000 * 60 * 60 * 8 },
}));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  if (IS_PROD) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  if (IS_PREVIEW) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "img-src 'self' data: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      // Babel + React from unpkg + inline event handlers, plus our own /content.js
      "script-src 'self' https://unpkg.com 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "connect-src 'self'",
      "form-action 'self'",
    ].join('; ')
  );
  next();
});

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

function stubSubmit(req, res) {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'invalid body' });
  }
  res.json({ ok: true });
}

app.post('/api/contact', stubSubmit);
app.post('/api/petition', stubSubmit);
app.post('/api/donate-intent', stubSubmit);
app.post('/api/newsletter', stubSubmit);

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  if (IS_PREVIEW) {
    res.send('User-agent: *\nDisallow: /\n');
  } else {
    const base = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: ${base}/sitemap.xml\n`);
  }
});

app.get('/sitemap.xml', (req, res) => {
  const base = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
  const routes = [
    '/', '/about', '/work', '/campaigns', '/news', '/donate', '/contact',
    '/issues/energy', '/issues/agriculture', '/issues/biodiversity', '/issues/industry',
  ];
  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes.map(r => `  <url><loc>${base}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`;
  res.type('application/xml').send(xml);
});

app.use('/assets', express.static(path.join(ROOT, 'assets')));
app.use('/admin', express.static(path.join(ROOT, 'admin')));
app.get('/favicon.svg', (req, res) => res.sendFile(path.join(ROOT, 'assets', 'favicon.svg')));
app.get('/favicon.ico', (req, res) => res.sendFile(path.join(ROOT, 'assets', 'favicon.svg')));

const SPA_PATHS = new Set([
  '/', '/about', '/work', '/campaigns', '/news', '/donate', '/contact',
]);
function isSpaPath(p) {
  if (SPA_PATHS.has(p)) return true;
  if (/^\/issues\/[a-z-]+$/.test(p)) return true;
  return false;
}

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/admin') || req.path.startsWith('/assets/')) {
    return next();
  }
  if (isSpaPath(req.path)) {
    return res.sendFile(path.join(ROOT, 'index.html'));
  }
  res.status(404).sendFile(path.join(ROOT, '404.html'));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(ROOT, '404.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`C4C server listening on http://localhost:${PORT}`);
    if (ADMIN_PASSWORD === 'change-me') {
      console.warn('WARNING: ADMIN_PASSWORD is the default. Set the env var before deploying.');
    }
  });
}

module.exports = app;
