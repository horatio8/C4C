// All Airtable writes for AEA + Coalition supporters go through here.
// - Native fetch only (no deps).
// - Field IDs (not names) on writes — survives renames in the Airtable UI.
// - Reads request `returnFieldsByFieldId=true` so we can index existing
//   records by field ID too.
//
// Required env vars:
//   AIRTABLE_API_KEY   — PAT scoped to data.records:read + data.records:write on this base
//   AIRTABLE_BASE_ID   — appSGua6tEPXWuGoT
//   AIRTABLE_TABLE_ID  — tblNqD7z6jHrU4A0C

const F = {
  Email:                'fldhd5GRtqj0W5U4P',
  FirstName:            'fld0mReCZeu6bpR08',
  LastName:             'flddyy8a5ya7MqGHo',
  Phone:                'fld54QRdFlqecasVu',
  Postcode:             'fldGRBMVljNM3E0Od',
  Site:                 'fldp92U2SEelvdeUv',
  Sources:              'fldpsNG04KgwspNgH',
  WhySigned:            'fldWwK2u7I8t3boZS',
  LastDonationAmount:   'fld0gNkLmxhvP7VJ2',
  DonationFrequency:    'fldKj13F9wQPlTbHE',
  TotalDonated:         'fldTevjORmu0L3fIm',
  DonationCount:        'fldwIyCZuSI3KIEGW',
  LastDonationAt:       'fldEMKRsuaJpSMOCB',
  StripeCustomerId:     'fld2b2SvoJGVNwIwu',
  StripeSubscriptionId: 'fldwTD3YJRghBXFX5',
  LastStripeEventId:    'fldp7H8Hh85aiyiW9',
  FirstSeenAt:          'fld2NHGDgof7GgIE9',
  LastUpdatedAt:        'flddrmYKKoaG6zrB0',
};

function isConfigured() {
  return !!(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID && process.env.AIRTABLE_TABLE_ID);
}

function base() {
  if (!isConfigured()) {
    const e = new Error('Airtable not configured (missing AIRTABLE_API_KEY / AIRTABLE_BASE_ID / AIRTABLE_TABLE_ID).');
    e.code = 'CONFIG';
    throw e;
  }
  return `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`;
}

function headers() {
  return {
    'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

async function airtableFetch(url, init) {
  const r = await fetch(url, { ...init, headers: { ...headers(), ...(init && init.headers || {}) } });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    const err = new Error(`Airtable ${r.status}: ${text.slice(0, 500)}`);
    err.status = r.status;
    throw err;
  }
  return r.json();
}

// Filter by lowercased email — handles case differences on the email field.
async function findByEmail(email) {
  const safe = String(email).toLowerCase().replace(/"/g, '\\"');
  const filter = encodeURIComponent(`LOWER({Email}) = "${safe}"`);
  const url = `${base()}?filterByFormula=${filter}&maxRecords=1&returnFieldsByFieldId=true`;
  const j = await airtableFetch(url, { method: 'GET' });
  return (j.records && j.records[0]) || null;
}

// Idempotency: skip if we've already stored this Stripe event id on any row.
async function eventAlreadyProcessed(eventId) {
  if (!eventId) return false;
  const safe = String(eventId).replace(/"/g, '\\"');
  const filter = encodeURIComponent(`{Last Stripe event ID} = "${safe}"`);
  const url = `${base()}?filterByFormula=${filter}&maxRecords=1&returnFieldsByFieldId=true`;
  try {
    const j = await airtableFetch(url, { method: 'GET' });
    return Array.isArray(j.records) && j.records.length > 0;
  } catch {
    return false;
  }
}

function readSourcesArray(rec) {
  if (!rec || !rec.fields) return [];
  const v = rec.fields[F.Sources];
  if (!Array.isArray(v)) return [];
  return v.map(s => (typeof s === 'string' ? s : (s && s.name) || '')).filter(Boolean);
}

/**
 * Upsert a supporter by email.
 *
 * input = {
 *   email                  required
 *   firstName, lastName,
 *   phone, postcode        optional identity fields
 *   site                   "affordableenergy.org.au" | "coalition.affordableenergy.org.au"
 *   source                 "petition" | "donation"
 *   whySigned              optional (petition only)
 *   donationAmount         dollars (not cents)
 *   donationFrequency      "one-time" | "monthly"
 *   stripeCustomerId, stripeSubscriptionId
 *   stripeEventId          used for idempotency on Stripe webhook calls
 * }
 *
 * Returns the record id (or "skipped-idempotent" when a Stripe event was
 * already processed).
 */
async function upsertSupporter(input) {
  const email = String(input.email || '').trim().toLowerCase();
  if (!email) throw new Error('upsertSupporter: email required');
  const now = new Date().toISOString();

  // Idempotency check for Stripe webhook retries
  if (input.stripeEventId && await eventAlreadyProcessed(input.stripeEventId)) {
    return 'skipped-idempotent';
  }

  const existing = await findByEmail(email);

  if (!existing) {
    const fields = {
      [F.Email]:         email,
      [F.Site]:          { name: input.site },
      [F.Sources]:       [{ name: input.source }],
      [F.FirstSeenAt]:   now,
      [F.LastUpdatedAt]: now,
    };
    if (input.firstName) fields[F.FirstName] = input.firstName;
    if (input.lastName)  fields[F.LastName]  = input.lastName;
    if (input.phone)     fields[F.Phone]     = input.phone;
    if (input.postcode)  fields[F.Postcode]  = input.postcode;
    if (input.whySigned) fields[F.WhySigned] = input.whySigned;

    if (input.source === 'donation' && typeof input.donationAmount === 'number') {
      fields[F.LastDonationAmount] = input.donationAmount;
      fields[F.DonationFrequency]  = { name: input.donationFrequency || 'one-time' };
      fields[F.TotalDonated]       = input.donationAmount;
      fields[F.DonationCount]      = 1;
      fields[F.LastDonationAt]     = now;
      if (input.stripeCustomerId)     fields[F.StripeCustomerId]     = input.stripeCustomerId;
      if (input.stripeSubscriptionId) fields[F.StripeSubscriptionId] = input.stripeSubscriptionId;
      if (input.stripeEventId)        fields[F.LastStripeEventId]    = input.stripeEventId;
    }

    const j = await airtableFetch(base(), {
      method: 'POST',
      body: JSON.stringify({ fields, typecast: true }),
    });
    return j.id;
  }

  // Existing record — patch with merged values.
  const prevSources = readSourcesArray(existing);
  const nextSources = Array.from(new Set([...prevSources, input.source]));

  const fields = {
    [F.LastUpdatedAt]: now,
    [F.Sources]:       nextSources.map(name => ({ name })),
  };
  // Identity fields: only overwrite if new value is non-empty.
  if (input.firstName) fields[F.FirstName] = input.firstName;
  if (input.lastName)  fields[F.LastName]  = input.lastName;
  if (input.phone)     fields[F.Phone]     = input.phone;
  if (input.postcode)  fields[F.Postcode]  = input.postcode;
  if (input.whySigned) fields[F.WhySigned] = input.whySigned;
  // Site is set-on-create only — don't change a supporter's home site.

  if (input.source === 'donation' && typeof input.donationAmount === 'number') {
    const prevTotal = Number(existing.fields && existing.fields[F.TotalDonated] || 0);
    const prevCount = Number(existing.fields && existing.fields[F.DonationCount] || 0);
    fields[F.LastDonationAmount] = input.donationAmount;
    fields[F.DonationFrequency]  = { name: input.donationFrequency || 'one-time' };
    fields[F.TotalDonated]       = prevTotal + input.donationAmount;
    fields[F.DonationCount]      = prevCount + 1;
    fields[F.LastDonationAt]     = now;
    if (input.stripeCustomerId)     fields[F.StripeCustomerId]     = input.stripeCustomerId;
    if (input.stripeSubscriptionId) fields[F.StripeSubscriptionId] = input.stripeSubscriptionId;
    if (input.stripeEventId)        fields[F.LastStripeEventId]    = input.stripeEventId;
  }

  await airtableFetch(`${base()}/${existing.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields, typecast: true }),
  });
  return existing.id;
}

module.exports = { F, isConfigured, findByEmail, eventAlreadyProcessed, upsertSupporter };
