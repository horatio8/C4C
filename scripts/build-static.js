#!/usr/bin/env node
// Build step: emits content.js, media.json, robots.txt, sitemap.xml at the
// project root. Also imports remote images (team photos, media featured
// images, logos) into /assets/imported/ and rewrites the *served* copies to
// same-origin paths, so production never depends on a third-party host
// (which broke when the old WordPress site hot-link-protected its images).

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_PATH = path.join(ROOT, 'content', 'content.json');
const MEDIA_SRC = path.join(ROOT, 'content', 'media.json');
const IMPORT_DIR = path.join(ROOT, 'assets', 'imported');
const BANNER_MANIFEST = path.join(__dirname, 'canva-banners.json');
const BANNER_DIR = path.join(ROOT, 'assets', 'banners');
const VENDOR_DIR = path.join(ROOT, 'assets', 'vendor');
const VENDOR_FILES = [
  { name: 'react.production.min.js', url: 'https://unpkg.com/react@18.3.1/umd/react.production.min.js' },
  { name: 'react-dom.production.min.js', url: 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js' },
  { name: 'babel.min.js', url: 'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js' },
];

function write(name, body) {
  fs.writeFileSync(path.join(ROOT, name), body);
  console.log(`build-static: wrote ${name} (${body.length} bytes)`);
}

// --- Remote image import ---------------------------------------------------
const IMG_RE = /https?:\/\/[^"'\s)]+\.(?:png|jpe?g|webp|gif)(?:\?[^"'\s)]*)?/gi;

function collectUrls(...jsonStrings) {
  const set = new Set();
  for (const s of jsonStrings) {
    const m = s.match(IMG_RE);
    if (m) m.forEach(u => set.add(u));
  }
  return [...set];
}

function localNameFor(url) {
  const ext = (url.split('?')[0].match(/\.(png|jpe?g|webp|gif)$/i) || ['.jpg'])[0].toLowerCase();
  return crypto.createHash('sha1').update(url).digest('hex').slice(0, 16) + ext;
}

async function importImages(urls) {
  fs.mkdirSync(IMPORT_DIR, { recursive: true });
  const map = {};
  let fetched = 0, kept = 0, failed = 0;
  for (const url of urls) {
    const name = localNameFor(url);
    const dest = path.join(IMPORT_DIR, name);
    const localPath = '/assets/imported/' + name;
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      map[url] = localPath; kept++; continue;
    }
    try {
      // Send a same-host Referer to defeat referer-based hot-link protection.
      let referer = '';
      try { const u = new URL(url); referer = u.origin + '/'; } catch {}
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; C4C-Importer/1.0)', 'Referer': referer },
        redirect: 'follow',
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 100) throw new Error('too small');
      fs.writeFileSync(dest, buf);
      map[url] = localPath; fetched++;
    } catch (e) {
      console.warn(`build-static: image import failed (${e.message}) ${url.slice(0, 80)}`);
      failed++; // leave original URL in place as a fallback
    }
  }
  console.log(`build-static: images — ${fetched} fetched, ${kept} kept, ${failed} failed`);
  return map;
}

function rewrite(jsonString, map) {
  let out = jsonString;
  for (const [orig, local] of Object.entries(map)) {
    out = out.split(orig).join(local);
  }
  return out;
}

async function main() {
  const contentStr = fs.readFileSync(CONTENT_PATH, 'utf8');
  const mediaStr = fs.existsSync(MEDIA_SRC) ? fs.readFileSync(MEDIA_SRC, 'utf8') : '';

  const urls = collectUrls(contentStr, mediaStr);
  const map = await importImages(urls);

  const content = JSON.parse(rewrite(contentStr, map));
  write('content.js', 'window.CONTENT = ' + JSON.stringify(content) + ';\n');
  if (mediaStr) {
    write('media.json', JSON.stringify(JSON.parse(rewrite(mediaStr, map))));
  }

  const isPreview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';
  const baseUrl =
    process.env.PUBLIC_URL ||
    (content.site && content.site.url) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    '';

  if (isPreview) {
    write('robots.txt', 'User-agent: *\nDisallow: /\n');
  } else {
    const sitemapLine = baseUrl ? `Sitemap: ${baseUrl}/sitemap.xml\n` : '';
    write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n${sitemapLine}`);
  }

  const routes = [
    '/', '/about', '/work', '/campaigns', '/media-and-webinars', '/donate', '/contact',
    '/issues/energy', '/issues/agriculture', '/issues/biodiversity',
  ];
  const today = new Date().toISOString().slice(0, 10);
  write('sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes.map(r => `  <url><loc>${baseUrl}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`);

  await fetchBanners();
  await fetchVendorJs();
}

// --- Vendor JS (React + Babel) self-host ----------------------------------
async function fetchVendorJs() {
  fs.mkdirSync(VENDOR_DIR, { recursive: true });
  let fetched = 0, kept = 0, failed = 0;
  for (const v of VENDOR_FILES) {
    const dest = path.join(VENDOR_DIR, v.name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) { kept++; continue; }
    try {
      const res = await fetch(v.url, { redirect: 'follow' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1000) throw new Error('too small');
      fs.writeFileSync(dest, buf);
      fetched++;
    } catch (e) {
      console.warn(`build-static: vendor ${v.name} fetch failed (${e.message}).`);
      failed++;
    }
  }
  console.log(`build-static: vendor JS — ${fetched} fetched, ${kept} kept, ${failed} failed`);
}

// --- Banner fetch (committed bytes win; manifest URLs are a fallback) -------
async function fetchBanners() {
  if (!fs.existsSync(BANNER_MANIFEST)) return;
  fs.mkdirSync(BANNER_DIR, { recursive: true });
  const manifest = JSON.parse(fs.readFileSync(BANNER_MANIFEST, 'utf8'));
  let fetched = 0, kept = 0, failed = 0;
  for (const b of (manifest.banners || [])) {
    const dest = path.join(BANNER_DIR, b.name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) { kept++; continue; }
    try {
      const res = await fetch(b.url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      fetched++;
    } catch (e) {
      console.warn(`build-static: banner ${b.name} fetch failed (${e.message}).`);
      failed++;
    }
  }
  console.log(`build-static: banners — ${fetched} fetched, ${kept} kept, ${failed} failed`);
}

main().catch(e => { console.error('build-static failed:', e); process.exit(1); });
