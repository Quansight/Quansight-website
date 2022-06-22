import { TTiles } from '../../../types/storyblok/bloks/libraryProps';

export const areValidSectionTiles = (tiles: TTiles): boolean =>
  Array.isArray(tiles) && !!tiles?.length;
