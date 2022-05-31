import {
  LibraryarticleItem,
  LibraryarticleItems,
  LibrarylinkItem,
  LibrarylinkItems,
} from '../../api/types/basic';

export type TLibraryTileRawData = LibrarylinkItem | LibraryarticleItem | null;

export type TLibraryTilesTileRawData = TLibraryTileRawData[];

export type TGetLibraryTilesProps = {
  articleItems: LibraryarticleItems;
  libraryLinks: LibrarylinkItems;
};
