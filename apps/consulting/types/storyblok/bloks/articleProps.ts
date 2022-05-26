import { ArticleItem, FooterItem } from '../../../api/types/basic';

export type TArticleProps = {
  data: ArticleItem;
  footer: FooterItem;
  preview: boolean;
};
