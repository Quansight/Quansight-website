import compose from 'lodash/fp/compose';
import filter from 'lodash/fp/filter';
import take from 'lodash/fp/take';

import { TPost } from '../../../../types/storyblok/bloks/blogPost';
import { TTiles } from '../../../../types/storyblok/bloks/libraryProps';
import { DEFAULT_API_OFFSET } from '../../constants';
import { getAllPosts } from '../../getLibraryPosts/getAllPosts';
import { getLibraryPostsTiles } from './getLibraryPostsTiles';

export const getPostsByCategory = async (
  category: string[],
  slug: string,
  limit = DEFAULT_API_OFFSET,
  preview,
): Promise<TTiles> => {
  try {
    const allPosts = await getAllPosts(preview);

    const items = compose(
      take(limit),
      filter(
        (post: TPost) =>
          post.slug !== slug &&
          (category || []).some((e) => post.meta.category.includes(e)),
      ),
    )(allPosts.items);

    return getLibraryPostsTiles({
      libraryPosts: { ...allPosts, items },
      libraryCategories: [],
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};
