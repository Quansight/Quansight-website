import { THeroProps } from '@quansight/shared/ui-components';
import { THeroRawData } from '../../../types/storyblok/bloks/hero';

export const getHeroProps = (blok: THeroRawData): THeroProps => ({
  title: blok.title,
  subTitle: blok.subTitle,
  variant: blok.variant,
});
