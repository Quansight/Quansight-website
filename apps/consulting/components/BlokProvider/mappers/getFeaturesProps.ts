import { TFeaturesProps } from '../../Features/types';
import { TFeaturesRawData } from '../../../types/storyblok/bloks/features';

export const getFeaturesProps = (blok: TFeaturesRawData): TFeaturesProps => ({
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
