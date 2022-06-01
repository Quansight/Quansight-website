import { TTiles } from '../../types/storyblok/bloks/libraryProps';

export const getSameCategoryTiles = (
  tiles: TTiles,
  currentPostCategories: string[],
): TTiles => {
  if (!tiles || tiles.length === 0) return [];
  if (tiles.length === 1) return tiles;
  const sameCategoryPosts = tiles.filter(({ postCategory }) =>
    postCategory.some((category) => currentPostCategories.includes(category)),
  );
  if (sameCategoryPosts.length === 0) return tiles.slice(0, 2);
  if (sameCategoryPosts.length === 1) return [sameCategoryPosts[0], tiles[0]];
  if (sameCategoryPosts.length >= 2) return sameCategoryPosts.slice(0, 2);

  return [];
};
