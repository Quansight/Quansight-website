import { DEFAULT_API_OFFSET } from '..';
import { getTeam } from '../../../api/utils/getTeam';
import { TPostsResponse } from '../../../types/storyblok/bloks/blogPost';
import {
  getAllPostFileNames,
  postFileExtensionRegExp,
} from './getAllPostFileNames';
import { serializePost } from './serializePost';

export const getAllPosts = async (
  preview: boolean,
): Promise<TPostsResponse> => {
  try {
    const team = await getTeam(preview);
    const postsFileNames = getAllPostFileNames();

    const posts = await Promise.all(
      postsFileNames.map(async (fileName) => {
        const slug = fileName.replace(postFileExtensionRegExp, '');
        const { content, meta } = await serializePost(fileName, team);

        return {
          slug,
          meta,
          content,
        };
      }),
    );

    return {
      items: posts,
      total: posts.length,
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
