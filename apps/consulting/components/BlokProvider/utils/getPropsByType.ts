import { ComponentType, TBlokComponentProps, TConsultingBlok } from '../types';

import { getTeaserProps } from '../mappers/getTeaserProps';

import { TTeaserProps } from '../../Teaser/types';

export const getPropsByType = (blok: TConsultingBlok): TBlokComponentProps => {
  return (
    {
      [ComponentType.Teaser]: getTeaserProps(
        blok as TConsultingBlok<TTeaserProps>,
      ),
    }[blok.component] || null
  );
};
