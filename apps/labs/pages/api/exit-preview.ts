import { NextApiHandler } from 'next';

const handler: NextApiHandler = (req, res) => {
  res.clearPreviewData();
  return res.status(200).end();
};

export default handler;
