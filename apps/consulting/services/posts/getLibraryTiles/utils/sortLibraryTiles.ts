import { TTiles } from '../../../../types/storyblok/bloks/libraryProps';
import { convertToDate } from './convertToDate';

export const sortLibraryTiles = (libraryTiles: TTiles = []): TTiles =>
  libraryTiles.sort(
    (libraryTileOne, libraryTileTwo) =>
      convertToDate(libraryTileTwo.date) - convertToDate(libraryTileOne.date),
  );
