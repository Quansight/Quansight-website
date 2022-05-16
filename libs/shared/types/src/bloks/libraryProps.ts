import {
  ArticleItem,
  ArticleItems,
  FooterItem,
  LibrarylinkItem,
  LibrarylinkItems,
  PageItem,
} from '@quansight/shared/storyblok-sdk';

export type TLibraryProps = {
  data: PageItem;
  footer: FooterItem;
  tiles: TLibraryTiles;
  preview: boolean;
};

export type TLibraryTile = LibrarylinkItem | ArticleItem | null;

export type TLibraryTiles = TLibraryTile[];

export type TGetLibraryTilesProps = {
  articleItems: ArticleItems;
  libraryLinks: LibrarylinkItems;
};
