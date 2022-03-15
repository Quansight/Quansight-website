import { THeroProps } from '@quansight/shared/ui-components';
import { THeroRawData } from '../../../types/storyblok/bloks/hero';
import { TConsultingBlok } from '../types';

export const getHeroProps = (
  blok: TConsultingBlok<THeroRawData>,
): THeroProps => ({
  title: blok.title,
  subTitle: blok.subTitle,
  variant: blok.variant,
});
