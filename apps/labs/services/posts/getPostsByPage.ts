import { TPost } from '../../types/storyblok/bloks/posts';
import { DEFAULT_API_OFFSET } from '../api/posts/constants';

export const getPostsByPage = (
  posts: TPost[],
  page: number,
  offset = DEFAULT_API_OFFSET,
): TPost[] => {
  const resultPage = page || 1;
  const startingPoint = (resultPage - 1) * offset;
  return posts.slice(startingPoint, startingPoint + offset);
};
