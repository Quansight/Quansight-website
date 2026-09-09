// Vercel Serverless Function (not an Astro route) — the site itself builds
// fully static, so this is the only place the Mailchimp API key is used.
// It must stay server-side only; never send it to the client.
//
// Required env vars (set in the Vercel project, not committed):
//   MAILCHIMP_API_KEY    -- Account > Extras > API keys. Its suffix after the
//                            "-" is the datacenter (e.g. "...-us21"), which
//                            is all we need to build the API host below.
//   MAILCHIMP_AUDIENCE_ID -- Audience > Settings > Audience name and defaults.
//
// Note: `astro dev` doesn't serve this /api folder — it's a Vercel-specific
// convention, not an Astro route. Test it with `vercel dev` instead.
import crypto from 'node:crypto';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID } = process.env;
  const datacenter = MAILCHIMP_API_KEY?.split('-').pop();
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID || !datacenter) {
    console.error('Mailchimp env vars are not configured');
    return res.status(500).json({ error: 'Newsletter signup is not configured' });
  }

  const email = String(req.body?.EMAIL ?? req.body?.email ?? '').trim();
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

  const mailchimpRes = await fetch(
    `https://${datacenter}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${subscriberHash}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: 'subscribed',
      }),
    },
  );

  const data = await mailchimpRes.json();

  if (!mailchimpRes.ok) {
    console.error('Mailchimp subscribe failed', data);
    return res.status(mailchimpRes.status).json({ error: data.detail || 'Subscription failed' });
  }

  return res.status(200).json({ success: true });
}
