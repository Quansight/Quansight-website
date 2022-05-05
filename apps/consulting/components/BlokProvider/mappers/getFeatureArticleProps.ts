import { TFeatureArticleRawData } from '../../../types/storyblok/bloks/featureArticle';
import { TFeatureArticleProps } from '../../FeatureArticle/types';

export const getFeatureArticleProps = (
  blok: TFeatureArticleRawData,
): TFeatureArticleProps => ({
  title: blok.title,
  description: blok.description,
  imageSrc: blok.image.filename,
  imageAlt: blok.image.alt,
  decorationSrc: blok.decoration?.filename,
  decorationAlt: blok.decoration?.alt,
});
