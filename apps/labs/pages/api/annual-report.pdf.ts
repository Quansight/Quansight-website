import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  // TODO - remove after checking the logs on Vercel
  console.log(`
  req.url ${req.url}
  req.referer ${req.headers.get('referer')}
  req.ip ${req.ip}
  user-agent ${req.headers.get('user-agent')}
  `);
  // The shape of this fetch comes from the Plausible docs:
  // https://plausible.io/docs/events-api
  await fetch('https://plausible.io/api/event', {
    method: 'POST',
    headers: {
      'User-Agent': req.headers.get('user-agent'),
      'X-Forwarded-For': req.ip,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      domain: 'gabalafou.com',
      name: 'pageview',
      url: req.url,
      referrer: req.headers.get('referer'),
    }),
  });
  // Returning fetch comes from Next.js docs:
  // https://nextjs.org/docs/api-routes/edge-api-routes#forwarding-headers
  return fetch(
    // TODO change this to the real annual report PDF
    'https://a.storyblok.com/f/152463/x/1752e51fa9/nf-annual-report-2021.pdf',
  );
}
