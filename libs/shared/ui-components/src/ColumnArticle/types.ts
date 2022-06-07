import { TRichText, TContent } from '@quansight/shared/types';

export type TColumnArticleSectionProps = {
  headerLevelModifier: number;
  content: TContent[];
};

export type TColumnArticleHeaderProps = {
  header: string;
  level: number;
};

export type TColumnArticleProps = {
  header: string;
  leftColumn: TRichText;
  rightColumn: TRichText;
  final: TRichText;
  imageSrc: string;
  imageAlt: string;
};
