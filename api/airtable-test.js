// TEMP diagnostic endpoint — DELETE after verifying the env vars.
// GET /api/airtable-test
// Returns:
//   { ok: true, recordCountSampled: N, stripeKeyPresent: bool,
//     stripeWebhookSecretPresent: bool, siteDomain: "..." }
// or:
//   { ok: false, stage: "config" | "airtable" | "network", detail: "..." }
//
// Does a tiny `maxRecords=1` Airtable read — no writes, no PII exposed.

const airtable = require('../lib/airtable');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method not allowed' });
  }

  // CMS/admin env presence (booleans + lengths only — no secret values).
  // The correct ADMIN_PASSWORD_HASH length is 174. Anything else = truncated on paste.
  const cmsEnv = {
    adminPasswordHashPresent: !!process.env.ADMIN_PASSWORD_HASH,
    adminPasswordHashLength: (process.env.ADMIN_PASSWORD_HASH || '').length,
    sessionSecretPresent: !!process.env.SESSION_SECRET,
    sessionSecretLength: (process.env.SESSION_SECRET || '').length,
    githubTokenPresent: !!process.env.GITHUB_TOKEN,
    githubOwner: process.env.GITHUB_OWNER || null,
    githubRepo: process.env.GITHUB_REPO || null,
    githubBranch: process.env.GITHUB_BRANCH || null,
    adminUsername: process.env.ADMIN_USERNAME || null,
  };

  if (!airtable.isConfigured()) {
    return res.status(503).json({
      ok: false,
      stage: 'config',
      cmsEnv,
      detail: 'Missing one or more of AIRTABLE_API_KEY / AIRTABLE_BASE_ID / AIRTABLE_TABLE_ID',
      airtableApiKeyPresent: !!process.env.AIRTABLE_API_KEY,
      airtableBaseIdPresent: !!process.env.AIRTABLE_BASE_ID,
      airtableTableIdPresent: !!process.env.AIRTABLE_TABLE_ID,
      stripeKeyPresent: !!process.env.STRIPE_SECRET_KEY,
      stripeWebhookSecretPresent: !!process.env.STRIPE_WEBHOOK_SECRET,
      siteDomain: process.env.SITE_DOMAIN || null,
    });
  }

  try {
    const r = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}?maxRecords=1&returnFieldsByFieldId=true`,
      { headers: { 'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}` } }
    );
    const text = await r.text();
    let parsed = null;
    try { parsed = JSON.parse(text); } catch {}

    if (!r.ok) {
      const detail = (parsed && (parsed.error && (parsed.error.message || parsed.error.type) || parsed.message)) || text.slice(0, 300);
      return res.status(r.status).json({
        ok: false,
        stage: 'airtable',
        status: r.status,
        detail,
        // Hints for the common failure modes:
        likelyCause:
          r.status === 401 ? 'AIRTABLE_API_KEY is wrong or the token has no access to this base.'
          : r.status === 403 ? 'Token exists but lacks data.records:read on this base. Re-issue with correct scopes.'
          : r.status === 404 ? 'AIRTABLE_BASE_ID or AIRTABLE_TABLE_ID is wrong.'
          : null,
      });
    }

    return res.status(200).json({
      ok: true,
      cmsEnv,
      recordCountSampled: (parsed && parsed.records && parsed.records.length) || 0,
      stripeKeyPresent: !!process.env.STRIPE_SECRET_KEY,
      stripeWebhookSecretPresent: !!process.env.STRIPE_WEBHOOK_SECRET,
      siteDomain: process.env.SITE_DOMAIN || null,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, stage: 'network', detail: String(e && e.message || e) });
  }
};
