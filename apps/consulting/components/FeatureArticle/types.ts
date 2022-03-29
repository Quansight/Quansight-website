import { TRichText } from '@quansight/shared/config';

export type TFeatureArticleProps = {
  title: string;
  description: TRichText;
  decorationSrc?: string;
  decorationAlt?: string;
  imageSrc: string;
  imageAlt: string;
};
