import { readFile, readdir } from 'fs/promises';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';

import { TPost } from '../../../types/storyblok/bloks/posts';
import { getPostPathToFile } from './getPostPathToFile';

export const getPost = async (slug: string): Promise<TPost | undefined> => {
  try {
    const postsFileNames = await readdir(path.join('apps/labs/posts'));
    const fileName = postsFileNames.find((name) => name.startsWith(slug));

    if (!fileName) {
      throw Error('No such file');
    }

    const result = await readFile(getPostPathToFile(fileName), 'utf-8');
    const { data, content } = matter(result);
    const source = await serialize(content, { scope: data });

    return {
      slug,
      meta: data as TPost['meta'],
      content: source,
    };
  } catch (error) {
    console.log('error', error);

    return undefined;
  }
};
