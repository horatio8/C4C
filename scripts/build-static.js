#!/usr/bin/env node
// Generates content.js, robots.txt, sitemap.xml at the project root.
// Runs at deploy time on Vercel (via vercel.json buildCommand) and any
// time content.json changes locally.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_PATH = path.join(ROOT, 'content', 'content.json');

function write(name, body) {
  fs.writeFileSync(path.join(ROOT, name), body);
  console.log(`build-static: wrote ${name} (${body.length} bytes)`);
}

const content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
write('content.js', 'window.CONTENT = ' + JSON.stringify(content) + ';\n');

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
  write(
    'robots.txt',
    `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n${sitemapLine}`
  );
}

const routes = [
  '/', '/about', '/work', '/campaigns', '/news', '/donate', '/contact',
  '/issues/energy', '/issues/agriculture', '/issues/biodiversity', '/issues/industry',
];
const today = new Date().toISOString().slice(0, 10);
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map(r => `  <url><loc>${baseUrl}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`;
write('sitemap.xml', sitemap);

// --- Banner fetch ----------------------------------------------------------
// scripts/canva-banners.json contains one-time Canva JPG export URLs per
// banner filename. Vercel's build environment can reach the Canva CDN; the
// repo doesn't track the bytes, so each deploy re-fetches anything missing
// from /assets/banners/. Already-present files (e.g. committed permanent
// artwork) win and aren't re-fetched.
const BANNER_MANIFEST = path.join(__dirname, 'canva-banners.json');
const BANNER_DIR = path.join(ROOT, 'assets', 'banners');

async function fetchBanners() {
  if (!fs.existsSync(BANNER_MANIFEST)) return;
  fs.mkdirSync(BANNER_DIR, { recursive: true });
  const manifest = JSON.parse(fs.readFileSync(BANNER_MANIFEST, 'utf8'));
  const banners = manifest.banners || [];
  let fetched = 0, kept = 0, failed = 0;
  for (const b of banners) {
    const dest = path.join(BANNER_DIR, b.name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      kept++;
      continue;
    }
    try {
      const res = await fetch(b.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log(`build-static: banner ${b.name} (${buf.length} bytes) ← page ${b.page}`);
      fetched++;
    } catch (e) {
      console.warn(`build-static: banner ${b.name} fetch failed (${e.message}). Falling back to gradient.`);
      failed++;
    }
  }
  console.log(`build-static: banners — ${fetched} fetched, ${kept} kept, ${failed} failed`);
}

fetchBanners().catch(e => {
  console.error('build-static: banner fetch crashed:', e);
  // Don't fail the build — the gradient placeholders still ship.
});
