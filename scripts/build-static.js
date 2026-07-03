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

// Verify bytes are a real raster/vector image by magic number — NOT by the
// Content-Type header or file extension. This is what stops an HTML error
// page (e.g. a moved/replaced origin that answers 200 with a SPA shell) from
// being written into an .jpg and then served as image/* by extension, which
// renders as a broken image in the browser.
function looksLikeImage(buf) {
  if (!buf || buf.length < 12) return false;
  const b = buf;
  if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return true;                       // JPEG
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return true;       // PNG
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return true;       // GIF
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&                  // RIFF…
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return true;     // …WEBP
  if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) return true;       // ftyp (AVIF/HEIC)
  const head = b.slice(0, 256).toString('utf8').trim().toLowerCase();
  if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) return true;
  return false;
}

function fileIsImage(p) {
  try {
    const fd = fs.openSync(p, 'r');
    const b = Buffer.alloc(256);
    const n = fs.readSync(fd, b, 0, 256, 0);
    fs.closeSync(fd);
    return looksLikeImage(b.slice(0, n));
  } catch { return false; }
}

async function importImages(urls) {
  fs.mkdirSync(IMPORT_DIR, { recursive: true });
  const map = {};
  const failed = [];
  let fetched = 0, kept = 0, failedCount = 0;
  for (const url of urls) {
    const name = localNameFor(url);
    const dest = path.join(IMPORT_DIR, name);
    const localPath = '/assets/imported/' + name;
    // Trust a committed/cached copy only if it is actually an image; a corrupt
    // (HTML-in-.jpg) leftover from a previous broken run is re-fetched, not kept.
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0 && fileIsImage(dest)) {
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
      if (!looksLikeImage(buf)) {
        const ct = (res.headers.get('content-type') || '?').split(';')[0];
        throw new Error(`not an image (got ${ct}, ${buf.length}b)`);
      }
      fs.writeFileSync(dest, buf);
      map[url] = localPath; fetched++;
    } catch (e) {
      console.warn(`build-static: image import failed (${e.message}) ${url.slice(0, 80)}`);
      failedCount++;
      failed.push(url);
      // Never leave a corrupt/partial file behind for the extension-based server to ship.
      try { if (fs.existsSync(dest)) fs.unlinkSync(dest); } catch {}
    }
  }
  console.log(`build-static: images — ${fetched} fetched, ${kept} kept, ${failedCount} failed`);
  return { map, failed };
}

function rewrite(jsonString, map) {
  let out = jsonString;
  for (const [orig, local] of Object.entries(map)) {
    out = out.split(orig).join(local);
  }
  return out;
}

// Blank out image URLs we could not import as real images. Leaving the dead
// remote URL in place would render a broken <img>; an empty value lets the UI
// fall back to its themed placeholder block instead.
function stripFailedImageUrls(jsonString, failed) {
  let out = jsonString;
  for (const url of failed) {
    out = out.split('"' + url + '"').join('""');
  }
  return out;
}

async function main() {
  const contentStr = fs.readFileSync(CONTENT_PATH, 'utf8');
  const mediaStr = fs.existsSync(MEDIA_SRC) ? fs.readFileSync(MEDIA_SRC, 'utf8') : '';

  const urls = collectUrls(contentStr, mediaStr);
  const { map, failed } = await importImages(urls);

  const content = JSON.parse(stripFailedImageUrls(rewrite(contentStr, map), failed));
  write('content.js', 'window.CONTENT = ' + JSON.stringify(content) + ';\n');
  if (mediaStr) {
    write('media.json', JSON.stringify(JSON.parse(stripFailedImageUrls(rewrite(mediaStr, map), failed))));
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
