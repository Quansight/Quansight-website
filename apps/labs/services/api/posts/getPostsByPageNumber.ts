import compose from 'lodash/fp/compose';
import filter from 'lodash/fp/filter';
import slice from 'lodash/fp/slice';

import {
  TPost,
  TPostsResponse,
} from '../../../../labs/types/storyblok/bloks/posts';
import { DEFAULT_API_OFFSET } from './constants';
import { getAllPosts } from './getAllPosts';

export const getPostsByPageNumber = async (
  pageNumber: number,
  category: string,
  offset = DEFAULT_API_OFFSET,
): Promise<TPostsResponse> => {
  try {
    const { items } = await getAllPosts();
    const itemsOffset = (pageNumber - 1) * offset;

    const data = compose(
      slice(itemsOffset, itemsOffset + offset),
      filter((post: TPost) => {
        if (!category) {
          return true;
        }

        if (post.meta?.category) {
          return post.meta.category.includes(category);
        }

        return false;
      }),
    )(items);

    return {
      items: data,
      total: data.length,
      offset: DEFAULT_API_OFFSET,
    };
  } catch (error) {
    console.log(error);

    return {
      items: [],
      total: 0,
      offset: DEFAULT_API_OFFSET,
    };
  }
};
