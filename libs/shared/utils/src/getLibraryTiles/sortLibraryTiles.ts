import { convertToDate } from './convertToDate';
import { TLibraryTiles } from './types';

export const sortLibraryTiles = (allTiles: TLibraryTiles): TLibraryTiles =>
  allTiles
    ? allTiles.sort(
        (libraryTileOne, libraryTileTwo) =>
          convertToDate(libraryTileTwo) - convertToDate(libraryTileOne),
      )
    : [];
