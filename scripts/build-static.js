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
