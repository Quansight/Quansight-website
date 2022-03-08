import { TBlok } from '../../types/storyblok/blok';
import { TFeatureProps } from '../../components/Feature/Feature';

export const getFeatureProps = (blok: TBlok<TFeatureProps>): TFeatureProps => ({
  name: blok.name,
});
