import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { PAGINATION_OFFSETT } from '../paginateLibraryTiles/constants';

export const divideLibraryTiles = (
  tiles: TTiles,
): { sectionTop: TTiles; sectionBottom: TTiles } => {
  const half = Math.ceil(PAGINATION_OFFSETT / 2);

  if (tiles.length <= half) return { sectionTop: tiles, sectionBottom: [] };

  const sectionTop = tiles.slice(0, half);
  const sectionBottom = tiles.slice(half - 1, -1);
  return { sectionTop, sectionBottom };
};
