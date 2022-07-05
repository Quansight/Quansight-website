import { THeroProps } from '@quansight/shared/ui-components';

import { THeroRawData } from '../../../types/storyblok/bloks/hero';

export const getHeroProps = (blok: THeroRawData): THeroProps => ({
  imageSrc: blok.image.filename,
  imageAlt: blok.image.alt,
  title: blok.title,
  subTitle: blok.subTitle,
  variant: blok.variant,
  objectFit: blok.objectFit,
  backgroundColor: blok?.backgroundColor,
  imageMobile: {
    imageSrc: blok?.imageMobile?.filename,
    imageAlt: blok?.imageMobile?.alt,
    objectFit: blok?.objectFitMobile,
  },
  imageTablet: {
    imageSrc: blok?.imageTablet?.filename,
    imageAlt: blok?.imageTablet?.alt,
    objectFit: blok?.objectFitTablet,
  },
  imageDesktop: {
    imageSrc: blok?.imageDesktop?.filename,
    imageAlt: blok?.imageDesktop?.alt,
    objectFit: blok?.objectFitDesktop,
  },
});
