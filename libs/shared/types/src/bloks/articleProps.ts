import {
  ArticleItem,
  FooterItem,
  HeaderItem,
} from '@quansight/shared/storyblok-sdk';

export type TArticleProps = {
  data: ArticleItem;
  footer: FooterItem;
  header: HeaderItem;
  preview: boolean;
};
