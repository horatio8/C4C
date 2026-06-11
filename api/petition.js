// AEA petition proxy — forwards to:
//   1. CampaignNucleus form receiver (primary, awaited; failure surfaces 502)
//   2. Airtable Supporters table     (secondary, fire-and-forget; logs errors)
//
// Site tagging on the Airtable row: env SITE_DOMAIN
// ("affordableenergy.org.au" or "coalition.affordableenergy.org.au").
const { readJsonBody } = require('../lib/auth');
const airtable = require('../lib/airtable');

const NUCLEUS_RECEIVER = 'https://c4c.campaignnucleus.com/forms/receiver/3e4ea7b9-1786-42dc-a2fb-53b5d1d54ed8';

// Whitelist the field handles the Nucleus form expects.
const ALLOWED = ['first_name', 'last_name', 'email', 'phone', 'postcode', 'whysigned'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }

  let body;
  try { body = await readJsonBody(req); } catch { return res.status(400).json({ error: 'invalid JSON body' }); }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'payload must be an object' });

  // Strip to whitelisted handles + light validation.
  const payload = {};
  for (const k of ALLOWED) {
    const v = body[k];
    payload[k] = typeof v === 'string' ? v.trim() : '';
  }
  // Required fields: first name, last name, email.
  if (!payload.first_name) return res.status(400).json({ error: 'first name required' });
  if (!payload.last_name) return res.status(400).json({ error: 'last name required' });
  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return res.status(400).json({ error: 'valid email required' });

  // 1. Campaign Nucleus — awaited. Failure here returns a 502 to the donor.
  // Note: don't send `tags` here — Nucleus form receivers can 500 on
  // unrecognised top-level keys. Use the Field Tagging tab on the Nucleus
  // form to auto-apply tags to every submission instead.
  try {
    const r = await fetch(NUCLEUS_RECEIVER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'C4C-Site/1.0' },
      body: JSON.stringify(payload),
    });
    const text = await r.text();
    if (!r.ok) {
      let detail = text;
      try { const j = JSON.parse(text); detail = j.message || j.error || text; } catch {}
      return res.status(502).json({ error: `Form receiver rejected the submission (HTTP ${r.status}): ${detail}` });
    }
  } catch (e) {
    return res.status(502).json({ error: `Network error reaching form receiver: ${String(e && e.message || e)}` });
  }

  // 2. Airtable upsert — fire-and-forget. Donor gets ok:true regardless; CN already has it.
  if (airtable.isConfigured()) {
    const site = process.env.SITE_DOMAIN || 'coalition.affordableenergy.org.au';
    airtable.upsertSupporter({
      email: payload.email,
      firstName: payload.first_name,
      lastName: payload.last_name,
      phone: payload.phone,
      postcode: payload.postcode,
      whySigned: payload.whysigned,
      site,
      source: 'petition',
    }).catch(err => {
      console.error('[airtable] petition upsert failed', { email: payload.email, err: err && err.message });
    });
  }

  return res.status(200).json({ ok: true });
};
