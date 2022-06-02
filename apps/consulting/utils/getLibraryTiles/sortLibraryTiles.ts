import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { convertToDate } from './services/convertToDate';

export const sortLibraryTiles = (allTiles: TTiles = []): TTiles =>
  allTiles.sort(
    (libraryTileOne, libraryTileTwo) =>
      convertToDate(libraryTileTwo.date) - convertToDate(libraryTileOne.date),
  );
