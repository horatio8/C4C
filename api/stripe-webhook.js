// Stripe → Airtable webhook receiver.
// Events handled:
//   - checkout.session.completed   (initial one-time + first subscription charge)
//   - invoice.payment_succeeded    (subscription renewal cycles only)
//
// Verifies the signature with STRIPE_WEBHOOK_SECRET. Reads the raw body.
// Resolves Site from Checkout Session.client_reference_id when present
// (set on the donate page when the donor clicks a button).
//
// Required env vars:
//   STRIPE_SECRET_KEY      sk_live_… (or sk_test_… in test mode)
//   STRIPE_WEBHOOK_SECRET  whsec_…   (one per registered endpoint)
//   AIRTABLE_*             see lib/airtable.js
const Stripe = require('stripe');
const airtable = require('../lib/airtable');

// Lazy: don't construct the client at import time (it throws if the env var
// isn't set yet — e.g. in local dev or during the initial Vercel build).
let _stripe = null;
function stripeClient() {
  if (_stripe) return _stripe;
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not set');
  _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' });
  return _stripe;
}

// Stripe needs the raw body to verify the signature — turn off Vercel's parser.
module.exports.config = { api: { bodyParser: false } };

function resolveSite(clientReferenceId) {
  if (clientReferenceId === 'coalition.affordableenergy.org.au') return 'coalition.affordableenergy.org.au';
  if (clientReferenceId === 'affordableenergy.org.au') return 'affordableenergy.org.au';
  // Default for renewals or untagged sessions — site from the existing
  // Airtable record is preserved by upsertSupporter; this only sets the
  // value when we have to create a new row.
  return process.env.SITE_DOMAIN || 'affordableenergy.org.au';
}

async function readRaw(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('method not allowed');
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return res.status(503).send('Stripe webhook not configured');
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) return res.status(400).send('Missing signature');

  let raw;
  try { raw = await readRaw(req); } catch (e) { return res.status(400).send('Could not read body'); }

  let event;
  let stripe;
  try { stripe = stripeClient(); } catch (e) { return res.status(503).send('Stripe webhook not configured'); }
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[stripe] signature check failed', err && err.message);
    return res.status(400).send(`Webhook Error: ${err && err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const full = await stripe.checkout.sessions.retrieve(session.id, { expand: ['line_items', 'customer'] });

      const customerEmail = (full.customer_details && full.customer_details.email)
        || (full.customer && typeof full.customer === 'object' && full.customer.email)
        || null;
      if (!customerEmail) return res.status(200).send('no email');

      const amount = (full.amount_total || 0) / 100;
      const isSubscription = full.mode === 'subscription';
      const fullName = (full.customer_details && full.customer_details.name) || '';
      const [firstName, ...rest] = fullName.split(/\s+/).filter(Boolean);
      const lastName = rest.join(' ');

      const customerId = typeof full.customer === 'string' ? full.customer : (full.customer && full.customer.id) || undefined;
      const subscriptionId = typeof full.subscription === 'string' ? full.subscription : (full.subscription && full.subscription.id) || undefined;

      await airtable.upsertSupporter({
        email: customerEmail,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: (full.customer_details && full.customer_details.phone) || undefined,
        postcode: (full.customer_details && full.customer_details.address && full.customer_details.address.postal_code) || undefined,
        site: resolveSite(full.client_reference_id),
        source: 'donation',
        donationAmount: amount,
        donationFrequency: isSubscription ? 'monthly' : 'one-time',
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripeEventId: event.id,
      });
      return res.status(200).json({ ok: true });
    }

    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      // Only count actual subscription cycles (skip the initial checkout invoice,
      // which is already covered by checkout.session.completed).
      if (invoice.billing_reason !== 'subscription_cycle') return res.status(200).send('skip');

      const email = invoice.customer_email;
      if (!email) return res.status(200).send('no email');

      const customerId = typeof invoice.customer === 'string' ? invoice.customer : (invoice.customer && invoice.customer.id) || undefined;
      const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : (invoice.subscription && invoice.subscription.id) || undefined;

      await airtable.upsertSupporter({
        email,
        // Renewals lose the original client_reference_id; the existing row's
        // Site is preserved by upsertSupporter, this default only applies if
        // a fresh row has to be created.
        site: resolveSite(null),
        source: 'donation',
        donationAmount: (invoice.amount_paid || 0) / 100,
        donationFrequency: 'monthly',
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripeEventId: event.id,
      });
      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ignored: event.type });
  } catch (err) {
    console.error('[stripe-webhook] handler error', err);
    // Return 500 so Stripe retries (with exponential backoff, up to 3 days).
    return res.status(500).send(`Handler error: ${err && err.message}`);
  }
};
