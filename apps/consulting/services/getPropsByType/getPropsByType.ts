import { ComponentType, TBlok } from '../../types/storyblok/blok';
import { TBlokComponentProps } from '../../constants/blokMap';
import { getTeaserProps } from '../mappers/getTeaserProps';
import { getFeatureProps } from '../mappers/getFeatureProps';
import { TTeaserProps } from '../../components/Teaser/Teaser';
import { TFeatureProps } from '../../components/Feature/Feature';

export const getPropsByType = (blok: TBlok): TBlokComponentProps => {
  switch (blok.component) {
    case ComponentType.Teaser:
      return getTeaserProps(blok as TBlok<TTeaserProps>);
    case ComponentType.Feature:
      return getFeatureProps(blok as TBlok<TFeatureProps>);
    default:
      return null;
  }
};
