import { TColumnsProps } from '../../Columns/types';
import { TColumnsRawData } from '../../../types/storyblok/bloks/columns';

export const getColumnsProps = (blok: TColumnsRawData): TColumnsProps => ({
  variant: blok.variant,
  columns: blok.columns.map(
    ({ _uid, image: { alt, filename }, title, text, linkText, linkUrl }) => ({
      _uid,
      imageSrc: filename,
      imageAlt: alt,
      title,
      text,
      linkText,
      linkUrl,
    }),
  ),
});
