import { THeroProps } from '@quansight/shared/ui-components';

import { THeroRawData } from '../../../types/storyblok/bloks/hero';

export const getHeroProps = (blok: THeroRawData): THeroProps => ({
  imageSrc: blok.image.filename,
  imageAlt: blok.image.alt,
  title: blok.title,
  subTitle: blok.subTitle,
  variant: blok.variant,
});
