import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
  res.setPreviewData({});
  const slug = Array.isArray(req.query.slug)
    ? req.query.slug.join('')
    : req.query.slug;
  const pageId = Array.isArray(req.query.pageId)
    ? req.query.pageId.join('')
    : req.query.pageId;

  // Set cookie to None, so it can be read in the Storyblok iframe
  const cookies = res.getHeader('Set-Cookie') as string[];
  res.setHeader(
    'Set-Cookie',
    cookies.map((cookie) =>
      cookie.replace('SameSite=Lax', 'SameSite=None;Secure'),
    ),
  );

  const url = new URL(req.url, `https://${req.headers.host}`);
  url.pathname = req.query.slug ? `/${slug}` : '/';

  if (pageId) {
    url.search += `&_storyblok=${pageId}`;
  }

  console.log('from enter-preview, redirecting', url.pathname + url.search);

  res.writeHead(307, {
    Location: url.pathname + url.search,
  });
  res.end('Preview mode enabled');
};

export default handler;
