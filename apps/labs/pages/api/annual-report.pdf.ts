import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
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

  switch (req.nextUrl.searchParams.get('year')) {
    case '2022':
      // Returning fetch comes from Next.js docs:
      // https://nextjs.org/docs/api-routes/edge-api-routes#forwarding-headers
      return fetch(
        'https://a.storyblok.com/f/152463/x/20372ca74f/quansight-labs-annual-report-2022.pdf',
      );
    case '2023':
      return fetch(
        'https://a.storyblok.com/f/152463/x/72fafda3df/quansight-labs-annual-report-2023.pdf',
      );
    case '2024': // falls through to default
    default:
      return fetch(
        'https://a.storyblok.com/f/152463/x/704327720f/labs-annual-report-2024.pdf',
      );
  }
}
