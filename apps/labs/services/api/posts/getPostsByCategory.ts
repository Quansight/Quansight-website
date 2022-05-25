import compose from 'lodash/fp/compose';
import filter from 'lodash/fp/filter';
import take from 'lodash/fp/take';

import { TPost } from '../../../types/storyblok/bloks/posts';
import { DEFAULT_API_OFFSET } from './constants';
import { getAllPosts } from './getAllPosts';

export const getPostsByCategory = async (
  category: string[],
  slug: string,
  limit = DEFAULT_API_OFFSET,
): Promise<TPost[]> => {
  try {
    const allPosts = await getAllPosts();

    return compose(
      take(limit),
      filter(
        (post: TPost) =>
          post.slug !== slug &&
          (category || []).some((e) => post.meta.category.includes(e)),
      ),
    )(allPosts.items);
  } catch (error) {
    console.error(error);
    return [];
  }
};
