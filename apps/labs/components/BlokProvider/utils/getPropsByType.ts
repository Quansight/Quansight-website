import { ComponentType, TBlokComponentProps, TLabsBlok } from '../types';
import { getTeaserProps } from '../mappers/getTeaserProps';
import { getFeatureProps } from '../mappers/getFeatureProps';
import { TTeaserProps } from '../../Teaser/Teaser';
import { TFeatureProps } from '../../Feature/Feature';

export const getPropsByType = (blok: TLabsBlok): TBlokComponentProps => {
  return (
    {
      [ComponentType.Teaser]: getTeaserProps(blok as TLabsBlok<TTeaserProps>),
      [ComponentType.Feature]: getFeatureProps(
        blok as TLabsBlok<TFeatureProps>,
      ),
    }[blok.component] || null
  );
};
