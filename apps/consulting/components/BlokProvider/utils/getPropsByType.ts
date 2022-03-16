import { ComponentType, TBlokComponentProps, TConsultingBlok } from '../types';
import { getTeaserProps } from '../mappers/getTeaserProps';
import { getFeatureProps } from '../mappers/getFeatureProps';
import { getBoardProps } from '../mappers/getBoardProps';
import { getHeroProps } from '../mappers/getHeroProps';

import { TTeaserProps } from '../../Teaser/Teaser';
import { TFeatureProps } from '../../Feature/Feature';
import { TBoardRawData } from '../../../types/storyblok/bloks/board';
import { THeroRawData } from '../../../types/storyblok/bloks/hero';

export const getPropsByType = (blok: TConsultingBlok): TBlokComponentProps => {
  return (
    {
      [ComponentType.Teaser]: getTeaserProps(
        blok as TConsultingBlok<TTeaserProps>,
      ),
      [ComponentType.Feature]: getFeatureProps(
        blok as TConsultingBlok<TFeatureProps>,
      ),
      [ComponentType.Board]: getBoardProps(
        blok as TConsultingBlok<TBoardRawData>,
      ),
      [ComponentType.Hero]: getHeroProps(blok as TConsultingBlok<THeroRawData>),
    }[blok.component] || null
  );
};
