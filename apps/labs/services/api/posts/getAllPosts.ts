import { readdir } from 'fs/promises';
import path from 'path';

import { TPostsResponse } from '../../../types/storyblok/bloks/posts';
import { DEFAULT_API_OFFSET, POSTS_DIRECTORY_PATH } from './constants';
import { getPost } from './getPost';

export const getAllPosts = async (): Promise<TPostsResponse> => {
  try {
    const postsFileNames = await readdir(path.join(POSTS_DIRECTORY_PATH));
    const posts = await Promise.all(
      postsFileNames.map(async (fileName) => {
        const slug = fileName.replace(/\.(md|mdx)$/, '');
        return getPost(slug);
      }),
    );

    return {
      items: posts,
      total: postsFileNames.length,
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
