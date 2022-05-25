import {
  ArticleItem,
  ArticleItems,
  LibrarylinkItem,
  LibrarylinkItems,
} from '../../api/types/basic';

export type TLibraryTileRawData = LibrarylinkItem | ArticleItem | null;

export type TLibraryTilesTileRawData = TLibraryTileRawData[];

export type TGetLibraryTilesProps = {
  articleItems: ArticleItems;
  libraryLinks: LibrarylinkItems;
};
