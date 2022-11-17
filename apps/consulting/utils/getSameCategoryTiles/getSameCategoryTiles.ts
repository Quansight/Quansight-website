import { TTiles } from '../../types/storyblok/bloks/libraryProps';

export const getSameCategoryTiles = (
  tiles: TTiles,
  currentPostCategories: string[],
  currentPostID: string,
): TTiles => {
  if (!tiles || tiles.length === 0) return [];

  if (tiles.length === 1) return tiles;

  const getSameCategoryLibraryPost = tiles.filter(
    ({ postCategory, key }) =>
      key !== currentPostID &&
      postCategory.some((category) => currentPostCategories.includes(category)),
  );

  const getSameCategoryBlogPosts = getSameCategoryLibraryPost.filter(
    ({ postType }) => postType === 'blog',
  );

  if (getSameCategoryBlogPosts.length === 1)
    return [getSameCategoryBlogPosts[0], getSameCategoryLibraryPost[0]];

  if (getSameCategoryBlogPosts.length >= 2)
    return getSameCategoryBlogPosts.slice(0, 2);

  if (getSameCategoryLibraryPost.length === 0) return tiles.slice(0, 2);

  if (getSameCategoryLibraryPost.length === 1)
    return [getSameCategoryLibraryPost[0], tiles[0]];

  if (getSameCategoryLibraryPost.length >= 2)
    return getSameCategoryLibraryPost.slice(0, 2);

  return [];
};
