import { ServerResponse } from 'http';

import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse): ServerResponse => {
  res.clearPreviewData();
  return res.status(200).end();
};

export default handler;
