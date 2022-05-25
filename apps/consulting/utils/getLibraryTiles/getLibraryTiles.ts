import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { getTileProps } from './getTileProps';
import { sortLibraryTiles } from './sortLibraryTiles';
import { TGetLibraryTilesProps, TLibraryTileRawData } from './types';

const defaultValues = { items: [], total: 0 };

export const getLibraryTiles = ({
  articleItems = defaultValues,
  libraryLinks = defaultValues,
}: TGetLibraryTilesProps): TTiles => {
  const allTiles =
    articleItems.items && libraryLinks.items
      ? [...articleItems.items, ...libraryLinks.items]
      : [];

  const sortedTiles = sortLibraryTiles(allTiles);

  return sortedTiles.map((item: TLibraryTileRawData) => getTileProps(item));
};
