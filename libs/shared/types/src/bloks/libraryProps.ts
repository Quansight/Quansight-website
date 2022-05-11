import {
  PageItem,
  FooterItem,
  LibrarylinkItems,
  ArticleItems,
} from '@quansight/shared/storyblok-sdk';

export type TLibraryProps = {
  data: PageItem;
  footer: FooterItem;
  articleItems: ArticleItems;
  libraryLinks: LibrarylinkItems;
  preview: boolean;
};
