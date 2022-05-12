import { TGetLibraryTilesProps, TLibraryTiles } from '@quansight/shared/types';

import { sortLibraryTiles } from './sortLibraryTiles';

const defaultValues = { items: [], total: 0 };

export const getLibraryTiles = ({
  articleItems = defaultValues,
  libraryLinks = defaultValues,
}: TGetLibraryTilesProps): TLibraryTiles => {
  const allTiles =
    articleItems.items && libraryLinks.items
      ? [...articleItems.items, ...libraryLinks.items]
      : [];

  return sortLibraryTiles(allTiles);
};
