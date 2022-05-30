import { TTiles } from '../..//types/storyblok/bloks/libraryProps';
import { PAGINATION_OFFSETT } from './constants';

export const paginateLibraryTiles = (
  tiles: TTiles,
  currentPage: number,
): TTiles => {
  if (tiles.length <= PAGINATION_OFFSETT) return tiles;
  const sliceFrom = (currentPage - 1) * PAGINATION_OFFSETT;
  const sliceTo = sliceFrom + PAGINATION_OFFSETT;

  return tiles.slice(sliceFrom, sliceTo);
};
