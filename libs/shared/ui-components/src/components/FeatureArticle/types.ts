import { TRichText } from '../../types';

export type TFeatureArticleProps = {
  title: string;
  description: TRichText;
  decorationSrc?: string;
  decorationAlt?: string;
  imageSrc: string;
  imageAlt: string;
};
