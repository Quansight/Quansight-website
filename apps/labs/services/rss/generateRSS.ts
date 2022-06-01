import * as fs from 'fs';
import * as path from 'path';

import { getPostsData } from './getPostsData';

export const generateRSS = async (): Promise<void> => {
  const postsData = await getPostsData();
  const rssPath = path.join(process.cwd(), 'apps/labs/public/rss.xml');

  try {
    fs.writeFileSync(rssPath, postsData);
  } catch (err) {
    console.log(err);
  }
};
