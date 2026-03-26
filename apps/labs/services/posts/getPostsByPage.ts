import { TPostSummary } from '../../types/storyblok/bloks/posts';
import { DEFAULT_API_OFFSET } from '../api/posts/constants';

export const getPostsByPage = (
  posts: TPostSummary[],
  page: number,
  offset = DEFAULT_API_OFFSET,
): TPostSummary[] => {
  const resultPage = page || 1;
  const startingPoint = (resultPage - 1) * offset;
  return posts.slice(startingPoint, startingPoint + offset);
};
