import {
  LibraryarticleItem,
  FooterItem,
  HeaderItem,
} from '../../../api/types/basic';
import { TTiles } from './libraryProps';

export type TLibraryArticleProps = {
  data: LibraryarticleItem;
  header: HeaderItem;
  footer: FooterItem;
  moreArticles: TTiles;
  preview: boolean;
};
