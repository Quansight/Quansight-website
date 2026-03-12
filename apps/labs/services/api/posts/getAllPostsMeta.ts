import { getTeam } from '../../../api/utils/getTeam';
import { TPostSummary } from '../../../types/storyblok/bloks/posts';
import {
  getAllPostFileNames,
  postFileExtensionRegExp,
} from '../../posts/getAllPostFileNames';
import { getPostMeta } from '../../posts/getPostMeta';
import { sortPostsByDate } from '../../posts/sortPostsByDate';

export const getAllPostsMeta = async (
  preview: boolean,
): Promise<TPostSummary[]> => {
  try {
    const team = await getTeam(preview);
    const postsFileNames = getAllPostFileNames();

    const posts = postsFileNames.map((fileName) => {
      const slug = fileName.replace(postFileExtensionRegExp, '');
      const meta = getPostMeta(fileName, team);

      return { slug, meta };
    });

    return sortPostsByDate(posts);
  } catch (error) {
    console.log('error', error);
    return [];
  }
};
