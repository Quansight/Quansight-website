import * as fs from 'fs';
import * as path from 'path';

import { Feed } from 'feed';

import { TPost } from '../../types/storyblok/bloks/posts';

const URLS = {
  site: 'https://labs.quansight.org',
  github: 'https://github.com',
  rss: 'apps/labs/public/rss.xml',
};

export const generateRSS = async (posts: TPost[]): Promise<void> => {
  const rssPath = path.join(process.cwd(), URLS.rss);
  const currentDate = new Date();

  const rssFeed = new Feed({
    title: 'Quansight Labs',
    description:
      'This is an RSS feed. To subscribe to it, copy its address and paste it when your feed reader asks for it. It will be updated periodically in your reader.',
    id: URLS.site,
    link: URLS.site,
    image: `${URLS.site}/logo.jpeg`,
    favicon: `${URLS.site}/favicon.ico`,
    copyright: `All rights reserved ${currentDate.getFullYear()}, Quansight`,
    author: {
      name: 'Quansight Labs',
      link: URLS.site,
    },
    feedLinks: {
      rss2: `${URLS.site}/rss.xml`,
    },
  });

  posts.forEach((post) => {
    rssFeed.addItem({
      title: post.meta.title,
      description: post.meta.description,
      date: new Date(post.meta.published),
      image: `${URLS.site}${post.meta.featuredImage.src}`,
      link: `${URLS.site}/blog/${post.slug}`,
      author: [
        {
          name: post.meta.author.fullName,
          link: `${URLS.github}/${post.meta.author.nickName}`,
        },
      ],
    });
  });

  fs.writeFileSync(rssPath, rssFeed.rss2());
};
