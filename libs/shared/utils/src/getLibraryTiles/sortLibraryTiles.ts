import { TLibraryTiles } from '@quansight/shared/types';

import { convertToDate } from './convertToDate';

export const sortLibraryTiles = (allTiles: TLibraryTiles = []): TLibraryTiles =>
  allTiles.sort(
    (libraryTileOne, libraryTileTwo) =>
      convertToDate(libraryTileTwo) - convertToDate(libraryTileOne),
  );
