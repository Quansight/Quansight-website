import { ServerResponse } from 'http';

import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse): ServerResponse => {
  res.clearPreviewData();
  return res.writeHead(307, { Location: '/' }).end();
};

export default handler;
