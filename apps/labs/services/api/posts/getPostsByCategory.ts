import compose from 'lodash/fp/compose';
import filter from 'lodash/fp/filter';
import take from 'lodash/fp/take';

import { TPostSummary } from '../../../types/storyblok/bloks/posts';
import { DEFAULT_API_OFFSET } from './constants';
import { getAllPostsMeta } from './getAllPostsMeta';

export const getPostsByCategory = async (
  category: string[],
  slug: string,
  limit = DEFAULT_API_OFFSET,
  preview,
): Promise<TPostSummary[]> => {
  try {
    const allPosts = await getAllPostsMeta(preview);

    return compose(
      take(limit),
      filter(
        (post: TPostSummary) =>
          post.slug !== slug &&
          (category || []).some((e) => post.meta.category.includes(e)),
      ),
    )(allPosts);
  } catch (error) {
    console.error(error);
    return [];
  }
};
