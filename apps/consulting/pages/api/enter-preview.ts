import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
  res.setPreviewData({});
  const slug = Array.isArray(req.query.slug)
    ? req.query.slug.join('')
    : req.query.slug;
  const pageId = Array.isArray(req.query.pageId)
    ? req.query.pageId.join('')
    : req.query.pageId;

  res.writeHead(307, {
    Location: req.query.slug ? `/${slug}?_storyblok=${pageId}` : '/',
  });
  res.end('Preview mode enabled');
};

export default handler;
