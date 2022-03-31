import { TTriptychProps } from '../../Triptych/types';
import { TTriptychRawData } from '../../../types/storyblok/bloks/triptych';

export const getTriptychProps = (blok: TTriptychRawData): TTriptychProps => ({
  title: blok.title,
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
