import { TFeatureProps } from '../../Feature/Feature';
import { TConsultingBlok } from '../types';

export const getFeatureProps = (
  blok: TConsultingBlok<TFeatureProps>,
): TFeatureProps => ({
  name: blok.name,
});
