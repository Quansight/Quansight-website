import { TTextArticleProps } from '../../TextArticle/types';
import { TTextArticleRawData } from '../../../types/storyblok/bloks/textArticle';

export const getTextArticleProps = (
  blok: TTextArticleRawData,
): TTextArticleProps => ({
  header: blok.header,
  text: blok.text,
});
