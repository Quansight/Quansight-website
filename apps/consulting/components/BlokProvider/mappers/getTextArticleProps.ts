import { TTextArticleRawData } from '../../../types/storyblok/bloks/textArticle';
import { TTextArticleProps } from '../../TextArticle/types';

export const getTextArticleProps = (
  blok: TTextArticleRawData,
): TTextArticleProps => ({
  header: blok.header,
  text: blok.text,
});
