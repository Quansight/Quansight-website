import * as fs from 'fs';
import * as path from 'path';

import { getPostProperty } from './getPostProperty';
import { TPostsData, PostProps } from './types';

export const getPostsData = async (): Promise<TPostsData[]> => {
  const filesPath = path.join(process.cwd(), 'apps/labs/posts');
  const files = fs
    .readdirSync(filesPath)
    .filter((file) => file.endsWith('.md'));

  const postsData = files.map((file) => {
    const content = fs.readFileSync(path.join(filesPath, file), 'utf8');

    const postProperties = {
      title: getPostProperty(content, PostProps.Title),
      description: getPostProperty(content, PostProps.Description),
      date: getPostProperty(content, PostProps.Date),
      imageUrl: getPostProperty(content, PostProps.Image),
      slug: file.replace(/\.md?$/, ''),
    };

    return {
      title: postProperties.title,
      description: postProperties.description,
      date: new Date(postProperties.date),
      image: `https://labs.quansight.org/${postProperties.imageUrl}`,
      link: `https://labs.quansight.org/blog/${postProperties.slug}`,
    };
  });

  return postsData;
};
