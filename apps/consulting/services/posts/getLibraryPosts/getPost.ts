import { getTeam } from '../../../api/utils/getTeam';
import { TPost } from '../../../types/storyblok/bloks/blogPost';
import { getAllPostFileNames } from './getAllPostFileNames';
import { serializePost } from './serializePost';

export const getPost = async (
  slug: string,
  preview: boolean,
): Promise<TPost | undefined> => {
  try {
    const team = await getTeam(preview);
    const postsFileNames = getAllPostFileNames();
    const fileName = postsFileNames.find((name) => name.startsWith(slug));

    if (!fileName) {
      throw Error('No such file');
    }

    const { content, meta } = await serializePost(fileName, team);

    return {
      slug,
      meta,
      content,
    };
  } catch (error) {
    console.log('error', error);

    return undefined;
  }
};
