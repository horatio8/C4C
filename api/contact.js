// Contact form proxy — forwards to the CampaignNucleus form receiver.
// Server-side forward sidesteps CORS and keeps the receiver URL out of the
// browser bundle. The Nucleus form receiver is the source of truth for which
// fields are captured (configured at https://c4c.campaignnucleus.com).
const { readJsonBody } = require('../lib/auth');

const NUCLEUS_RECEIVER = 'https://c4c.campaignnucleus.com/forms/receiver/0eadc553-7b59-485d-821a-bc6b14fb5bdc';

// Whitelist the field handles the Nucleus form expects.
const ALLOWED = ['first_name', 'last_name', 'email', 'organisation', 'subject', 'message', 'type'];

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
  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return res.status(400).json({ error: 'invalid email' });
  if (!payload.first_name) return res.status(400).json({ error: 'first name required' });
  if (!payload.last_name) return res.status(400).json({ error: 'last name required' });
  if (!payload.subject) return res.status(400).json({ error: 'subject required' });
  if (!payload.message) return res.status(400).json({ error: 'message required' });

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
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: `Network error reaching form receiver: ${String(e && e.message || e)}` });
  }
};
