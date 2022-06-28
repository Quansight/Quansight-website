import { TColumnArticleProps } from '@quansight/shared/ui-components';

import { TColumnArticleRawData } from '../../../types/storyblok/bloks/columnArticle';

export const getColumnArticleProps = (
  blok: TColumnArticleRawData,
): TColumnArticleProps => ({
  header: blok.header,
  leftColumn: blok.leftColumn,
  rightColumn: blok.rightColumn,
  final: blok.final,
  imageSrc: blok.image.filename,
  imageAlt: blok.image.alt,
});
