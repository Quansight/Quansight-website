import {
  HeaderItem,
  FooterItem,
  LibraryarticleItem,
} from '../../../api/types/basic';

export type TArticleProps = {
  data: LibraryarticleItem;
  footer: FooterItem;
  header: HeaderItem;
  preview: boolean;
};
