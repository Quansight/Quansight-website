import * as fs from 'fs';
import * as path from 'path';

import { getPostProperty, getPostImageProperty } from './getPostProperty';

export const getPostsData = async (): Promise<string> => {
  const filesPath = path.join(process.cwd(), 'apps/labs/posts');
  const files = fs
    .readdirSync(filesPath)
    .filter((file) => file.endsWith('.md'));

  const postsData = files.map((file) => {
    const postContent = fs.readFileSync(path.join(filesPath, file), 'utf8');

    const postProperties = {
      title: getPostProperty(postContent, /title:.*/, 'title'),
      description: getPostProperty(
        postContent,
        /description:.*/,
        'description',
      ),
      date: getPostProperty(postContent, /published:.*/, 'published'),
      imageUrl: getPostImageProperty(postContent, /featuredImage:\n\s\ssrc:.*/),
      slug: file.replace(/\.md?$/, ''),
    };

    const postData = {
      title: postProperties.title,
      description: postProperties.description,
      date: postProperties.date,
      image: `https://labs.quansight.org/${postProperties.imageUrl}`,
      link: `https://labs.quansight.org/blog/${postProperties.slug}`,
    };

    return postData;
  });

  return JSON.stringify(postsData);
};
