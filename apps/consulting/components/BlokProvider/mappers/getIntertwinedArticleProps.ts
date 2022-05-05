import { TIntertwinedArticleRawData } from '../../../types/storyblok/bloks/intertwinedArticle';
import { TIntertwinedArticleProps } from '../../IntertwinedArticle/types';

export const getIntertwinedArticleProps = (
  blok: TIntertwinedArticleRawData,
): TIntertwinedArticleProps => ({
  title: blok.title,
  sections: blok.sections.map(({ _uid, text, image: { alt, filename } }) => ({
    _uid,
    text,
    imageSrc: filename,
    imageAlt: alt,
  })),
  footer: blok.footer,
});
