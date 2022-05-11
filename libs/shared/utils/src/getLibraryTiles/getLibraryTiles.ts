import { TGetLibraryTilesProps, TLibraryTiles } from '@quansight/shared/types';

import { sortLibraryTiles } from './sortLibraryTiles';

export const getLibraryTiles = ({
  articleItems,
  libraryLinks,
}: TGetLibraryTilesProps): TLibraryTiles => {
  const allTiles =
    articleItems.items && libraryLinks.items
      ? [...articleItems.items, ...libraryLinks.items]
      : [];

  return sortLibraryTiles(allTiles);
};
