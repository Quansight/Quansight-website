import { PageItem, FooterItem, HeaderItem } from '../../../api/types/basic';
import { TTiles } from './libraryProps';

export type TLibraryArticleProps = {
  data: PageItem;
  header: HeaderItem;
  footer: FooterItem;
  moreArticles: TTiles;
  preview: boolean;
};
