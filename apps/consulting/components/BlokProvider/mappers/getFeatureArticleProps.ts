import { TFeatureArticleProps } from '@quansight/shared/ui-components';
import { TFeatureArticleRawData } from '../../../types/storyblok/bloks/featureArticle';

export const getFeatureArticleProps = (
  blok: TFeatureArticleRawData,
): TFeatureArticleProps => ({
  title: blok.title,
  description: blok.description,
  imageSrc: blok.image.filename,
  imageAlt: blok.image.alt,
  decorationSrc: blok.decoration.filename,
  decorationAlt: blok.decoration.alt,
});
