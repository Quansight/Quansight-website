import { readdirSync, readFileSync } from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';

import { TPost, TPostsResponse } from '../../../types/storyblok/bloks/posts';
import { DEFAULT_API_OFFSET, POSTS_DIRECTORY_PATH } from './constants';
import { getPostPathToFile } from './getPostPathToFile';

export const getAllPosts = async (): Promise<TPostsResponse> => {
  try {
    const postsFileNames = readdirSync(
      path.join(process.cwd(), POSTS_DIRECTORY_PATH),
    );
    const postsFileNamesFiltered = postsFileNames.filter(
      (fileName) => fileName !== 'categories.json',
    );

    const posts = await Promise.all(
      postsFileNamesFiltered
        .filter((fileName) => fileName !== 'categories.json')
        .map(async (fileName) => {
          const slug = fileName.replace(/\.(md|mdx)$/, '');
          const fileContent = readFileSync(
            getPostPathToFile(fileName),
            'utf-8',
          );
          const { data, content } = matter(fileContent);
          const source = await serialize(content, { scope: data });

          return {
            slug,
            meta: data as TPost['meta'],
            content: source,
          };
        }),
    );

    return {
      items: posts,
      total: postsFileNamesFiltered.length,
      offset: DEFAULT_API_OFFSET,
    };
  } catch (error) {
    console.log('error', error);

    return {
      items: [],
      total: 0,
      offset: DEFAULT_API_OFFSET,
    };
  }
};
