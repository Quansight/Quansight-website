import { ArticleItem, FooterItem } from '../../../api/types/basic';

export type TArticleProps = {
  data: ArticleItem;
  footer: FooterItem;
  header: HeaderItem;
  preview: boolean;
};
