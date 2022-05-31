import {
  LibraryarticleItem,
  FooterItem,
  HeaderItem,
} from '../../../api/types/basic';

export type TLibraryArticleProps = {
  data: LibraryarticleItem;
  header: HeaderItem;
  footer: FooterItem;
  preview: boolean;
};
