import { TRichText } from '@quansight/shared/types';

export type TColumnArticleFragmentProps = {
  modifier: number;
  content: TRichText;
};

export type TColumnArticleHeaderProps = {
  header: string;
  level: number;
  className?: string;
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
