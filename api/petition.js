// AEA petition proxy — forwards to:
//   1. CampaignNucleus form receiver (primary, awaited; failure surfaces 502)
//   2. Airtable Supporters table     (secondary, fire-and-forget; logs errors)
//
// Site tagging on the Airtable row: env SITE_DOMAIN
// ("affordableenergy.org.au" or "coalition.affordableenergy.org.au").
const { readJsonBody } = require('../lib/auth');
const airtable = require('../lib/airtable');

const NUCLEUS_RECEIVER = 'https://c4c.campaignnucleus.com/forms/receiver/3e4ea7b9-1786-42dc-a2fb-53b5d1d54ed8';
// Secondary Campaign Nucleus receiver (Teller) — lodged in parallel, best-effort.
const NUCLEUS_RECEIVER_SECONDARY = 'https://teller.campaignnucleus.com/forms/receiver/c18454ac-62c7-4960-824c-79c057f5752b';

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

  // Note: don't send `tags` here — Nucleus form receivers can 500 on
  // unrecognised top-level keys. Use the Field Tagging tab on the Nucleus
  // form to auto-apply tags to every submission instead.
  const cnHeaders = { 'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'C4C-Site/1.0' };
  const cnBody = JSON.stringify(payload);

  // Secondary Campaign Nucleus receiver (Teller) — fired in parallel, best-effort.
  // Its result is logged but never blocks or fails the signature; the primary
  // receiver is authoritative. This wrapper never rejects.
  const secondaryDone = fetch(NUCLEUS_RECEIVER_SECONDARY, { method: 'POST', headers: cnHeaders, body: cnBody })
    .then(async r => {
      if (!r.ok) console.error('[nucleus-secondary] rejected', r.status, (await r.text().catch(() => '')).slice(0, 200));
      else console.log('[nucleus-secondary] ok');
    })
    .catch(e => console.error('[nucleus-secondary] network error', String(e && e.message || e)));

  // 1. Campaign Nucleus PRIMARY — awaited. Failure here returns a 502 to the signer.
  try {
    const r = await fetch(NUCLEUS_RECEIVER, { method: 'POST', headers: cnHeaders, body: cnBody });
    const text = await r.text();
    if (!r.ok) {
      let detail = text;
      try { const j = JSON.parse(text); detail = j.message || j.error || text; } catch {}
      await secondaryDone;
      return res.status(502).json({ error: `Form receiver rejected the submission (HTTP ${r.status}): ${detail}` });
    }
  } catch (e) {
    await secondaryDone;
    return res.status(502).json({ error: `Network error reaching form receiver: ${String(e && e.message || e)}` });
  }

  // Ensure the secondary POST completes before the serverless function returns
  // (fire-and-forget can be frozen on Vercel after the response is sent).
  await secondaryDone;

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
