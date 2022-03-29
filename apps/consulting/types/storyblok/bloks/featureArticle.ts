import { TRichText, TImage, TBlok } from '@quansight/shared/config';
import { ComponentType } from '../../../components/BlokProvider/types';

export type TFeatureArticleRawData = {
  component: ComponentType.FeatureArticle;
  title: string;
  description: TRichText;
  decoration?: TImage;
  image: TImage;
} & TBlok;
