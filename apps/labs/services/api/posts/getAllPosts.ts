import { TPostsResponse } from '../../../types/storyblok/bloks/posts';
import { getPostsDirectory } from '../../posts/getPostsDirectory';
import { serializePost } from '../../posts/serializePost';
import { sortPostsByDate } from '../../posts/sortPostsByDate';
import { DEFAULT_API_OFFSET } from './constants';

export const getAllPosts = async (): Promise<TPostsResponse> => {
  try {
    const postsFileNames = getPostsDirectory();
    const postsFileNamesFiltered = postsFileNames.filter(
      (fileName) => fileName !== 'categories.json',
    );

    const posts = await Promise.all(
      postsFileNamesFiltered.map(async (fileName) => {
        const slug = fileName.replace(/\.(md|mdx)$/, '');
        const { content, meta } = await serializePost(fileName);

        return {
          slug,
          meta,
          content,
        };
      }),
    );

    const sortedPosts = sortPostsByDate(posts);

    return {
      items: sortedPosts,
      total: sortedPosts.length,
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
