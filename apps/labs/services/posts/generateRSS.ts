import * as fs from 'fs';
import * as path from 'path';

import { Feed } from 'feed';

import { RSS_DIRECTORY_PATH } from '../../services/api/posts/constants';
import { TPost } from '../../types/storyblok/bloks/posts';

export const generateRSS = async (posts: TPost[]): Promise<void> => {
  const siteUrl = process.env.DOMAIN;
  const rssPath = path.join(process.cwd(), RSS_DIRECTORY_PATH);
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
    author: {
      name: 'Quansight Labs',
      link: siteUrl,
    },
    feedLinks: {
      rss2: `${siteUrl}/rss.xml`,
    },
  });

  posts.forEach((post) => {
    rssFeed.addItem({
      title: post.meta.title,
      description: post.meta.description,
      date: new Date(post.meta.published),
      image: `${siteUrl}${post.meta.featuredImage.src}`,
      link: `${siteUrl}/blog/${post.slug}`,
      author: [
        {
          name: post.meta.authors[0].fullName,
          link: `https://github.com/${post.meta.authors[0].nickName}`,
        },
      ],
    });
  });

  fs.writeFileSync(rssPath, rssFeed.rss2());
};
