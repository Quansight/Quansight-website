import { TPost } from '../../types/storyblok/bloks/posts';
import { DEFAULT_API_OFFSET } from '../api/posts/constants';

export const getPostsByPage = (
  posts: TPost[],
  page: number,
  offset = DEFAULT_API_OFFSET,
): TPost[] => {
  const startingPoint = (page - 1) * offset;
  return page ? posts.slice(startingPoint, startingPoint + offset) : posts;
};
