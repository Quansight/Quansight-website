import { TRichText } from '@quansight/shared/types';

export type TColumnArticleHeaderProps = {
  header: string;
  level: number;
};

export type TColumnArticleParagraphProps = {
  text: string;
};

export type TColumnArticleProps = {
  header: string;
  leftColumn: TRichText;
  rightColumn: TRichText;
  final: TRichText;
  imageSrc: string;
  imageAlt: string;
};
