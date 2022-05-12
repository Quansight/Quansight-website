import { TPost } from '../../../types/storyblok/bloks/posts';
import { getPostsDirectory } from '../../posts/getPostsDirectory';
import { serializePost } from '../../posts/serializePost';

export const getPost = async (slug: string): Promise<TPost | undefined> => {
  try {
    const postsFileNames = getPostsDirectory();
    const fileName = postsFileNames.find((name) => name.startsWith(slug));

    if (!fileName) {
      throw Error('No such file');
    }

    const { content, meta } = await serializePost(fileName);

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
