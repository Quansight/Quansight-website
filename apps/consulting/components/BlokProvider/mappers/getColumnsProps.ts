import { TColumnsProps } from '../../Columns/types';
import { TColumnsRawData } from '../../../types/storyblok/bloks/columns';

export const getColumnsProps = (blok: TColumnsRawData): TColumnsProps => ({
  columns: blok.columns.map(
    ({ _uid, image: { alt, filename }, title, text }) => ({
      _uid,
      imageSrc: filename,
      imageAlt: alt,
      title,
      text,
    }),
  ),
});
