import { TRichText } from '@quansight/shared/types';

export type TIntertwinedArticleItemProps = {
  _uid: string;
  text: TRichText;
  imageSrc: string;
  imageAlt: string;
};

export type TIntertwinedArticleProps = {
  title: string;
  sections: TIntertwinedArticleItemProps[];
  footer?: TRichText;
};
