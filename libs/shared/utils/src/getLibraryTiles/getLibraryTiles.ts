import { sortLibraryTiles } from './sortLibraryTiles';
import { TGetLibraryTilesProps, TLibraryTiles } from './types';

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
