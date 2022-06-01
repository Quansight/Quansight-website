import * as fs from 'fs';
import * as path from 'path';

import { Feed } from 'feed';

import { getPostsData } from './getPostsData';

export const generateRSS = async (): Promise<void> => {
  const postsData = await getPostsData();
  const rssPath = path.join(process.cwd(), 'apps/labs/public/rss.xml');
  const siteUrl = 'https://labs.quansight.org/';
  const currentDate = new Date();

  const rssFeed = new Feed({
    title: 'Quansight Labs',
    description:
      'This is an RSS feed. To subscribe to it, copy its address and paste it when your feed reader asks for it. It will be updated periodically in your reader.',
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/logo.jpeg`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${currentDate.getFullYear()}, Quansight`,
    feedLinks: {
      rss2: `${siteUrl}/rss.xml`,
    },
  });

  postsData.forEach((postData) => rssFeed.addItem(postData));

  try {
    fs.writeFileSync(rssPath, rssFeed.rss2());
  } catch (err) {
    console.log(err);
  }
};
