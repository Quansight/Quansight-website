import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  res.setPreviewData({});
  res.writeHead(307, {
    Location: req.query.slug
      ? `/${req.query.slug}?_storyblok=${req.query.pageId}`
      : '/',
  });
  res.end('Preview mode enabled');
};

export default handler;
