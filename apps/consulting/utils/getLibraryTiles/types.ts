import {
  ArticleItem,
  ArticleItems,
  LibrarylinkItem,
  LibrarylinkItems,
} from '@quansight/shared/storyblok-sdk';

export type TLibraryTileRawData = LibrarylinkItem | ArticleItem | null;

export type TLibraryTilesTileRawData = TLibraryTileRawData[];

export type TGetLibraryTilesProps = {
  articleItems: ArticleItems;
  libraryLinks: LibrarylinkItems;
};
