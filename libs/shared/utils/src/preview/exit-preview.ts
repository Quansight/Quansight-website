import { ServerResponse } from 'http';

import { NextApiRequest, NextApiResponse } from 'next';

export const exitPreviewHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
): ServerResponse => {
  res.clearPreviewData();
  return res.writeHead(307, { Location: '/' }).end();
};
