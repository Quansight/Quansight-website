import { getTeam } from '../../../api';
import { TPost } from '../../../types/storyblok/bloks/posts';
import { getAllPostFileNames } from '../../posts/getAllPostFileNames';
import { serializePost } from '../../posts/serializePost';

export const getPost = async (slug: string): Promise<TPost | undefined> => {
  try {
    const team = await getTeam();
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
