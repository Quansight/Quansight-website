import intersection from 'lodash/intersection';
import composeFp from 'lodash/fp/compose';
import takeFp from 'lodash/fp/take';
import filterFp from 'lodash/fp/filter';

import { TPost } from '../../../types/storyblok/bloks/posts';
import { getAllPosts } from './getAllPosts';
import { DEFAULT_API_OFFSET } from './constants';

export const getPostsByCategory = async (
  category: string[],
  slug: string,
  limit = DEFAULT_API_OFFSET,
): Promise<TPost[]> => {
  try {
    const allPosts = await getAllPosts();

    return composeFp(
      takeFp(limit),
      filterFp(
        (post) =>
          post.slug !== slug &&
          Boolean(intersection(category, post.meta.category).length),
      ),
    )(allPosts.items);
  } catch (error) {
    console.log(error);
    return [];
  }
};
