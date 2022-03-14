import { THeroProps } from '@quansight/shared/ui-components';
import { TConsultingBlok } from '../types';

export const getHeroProps = (
  blok: TConsultingBlok<THeroProps>,
): THeroProps => ({
  title: blok.title,
  subTitle: blok.subTitle,
  variant: blok.variant,
});
