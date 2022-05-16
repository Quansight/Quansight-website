import { convertToDate } from './services/convertToDate';
import { TLibraryTilesTileRawData } from './types';

export const sortLibraryTiles = (
  allTiles: TLibraryTilesTileRawData = [],
): TLibraryTilesTileRawData =>
  allTiles.sort(
    (libraryTileOne, libraryTileTwo) =>
      convertToDate(libraryTileTwo) - convertToDate(libraryTileOne),
  );
