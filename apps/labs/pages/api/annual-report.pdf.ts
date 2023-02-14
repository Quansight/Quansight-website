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
      domain: 'labs.quansight.org',
      name: 'pageview',
      url: req.url,
      // A note about spelling: `referrer` on the left (double r) is from the
      // Plausible spec: https://plausible.io/docs/events-api. `referer` on the
      // right (single r) is from the HTTP spec. To read more:
      // https://en.wikipedia.org/wiki/HTTP_referer#Etymology
      referrer: req.headers.get('referer'),
    }),
  });
  // A few reasons to use 302 vs 301:
  // - Ensures that this handler gets called every time that somebody clicks the
  //   tracking URL for the PDF even if they've clicked it before.
  // - It signals to search engines and other tech that we do not consider the
  //   CDN URL for the annual report to be the canonical URL for this resource.
  return Response.redirect(
    'https://a.storyblok.com/f/152463/x/015c6aa140/labs-annual-report-2022.pdf',
    302,
  );
}
