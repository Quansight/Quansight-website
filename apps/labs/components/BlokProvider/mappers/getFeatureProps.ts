import { TFeatureProps } from '../../Feature/Feature';
import { TLabsBlok } from '../types';

export const getFeatureProps = (
  blok: TLabsBlok<TFeatureProps>,
): TFeatureProps => ({
  name: blok.name,
});
