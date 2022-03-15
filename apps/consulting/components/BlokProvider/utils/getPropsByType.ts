import { ComponentType, TBlokComponentProps, TConsultingBlok } from '../types';
import { getTeaserProps } from '../mappers/getTeaserProps';
import { getFeatureProps } from '../mappers/getFeatureProps';
import { getBoardProps } from '../mappers/getBoardProps';
import { TTeaserProps } from '../../Teaser/Teaser';
import { TFeatureProps } from '../../Feature/Feature';
import { TBoardProps } from '../../Board/Board';

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
        blok as TConsultingBlok<TBoardProps>,
      ),
    }[blok.component] || null
  );
};
