import { NextApiRequest, NextApiResponse } from 'next';
import { ServerResponse } from 'http';

const handler = (req: NextApiRequest, res: NextApiResponse): ServerResponse => {
  res.clearPreviewData();
  return res.status(200).end();
};

export default handler;
