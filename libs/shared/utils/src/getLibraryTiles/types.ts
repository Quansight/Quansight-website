import {
  ArticleItems,
  ArticleItem,
  LibrarylinkItem,
  LibrarylinkItems,
} from '@quansight/shared/storyblok-sdk';

export type TLibraryTile = LibrarylinkItem | ArticleItem | null;
export type TLibraryTiles = TLibraryTile[];

export type TGetLibraryTilesProps = {
  articleItems: ArticleItems;
  libraryLinks: LibrarylinkItems;
};
