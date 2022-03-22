import { ComponentType, TBlokComponentProps } from '../types';

import { getLogosProps } from '../mappers/getLogosProps';

import { TRawBlok } from '../../../types/storyblok/bloks/rawBlock';

export const getPropsByType = (blok: TRawBlok): TBlokComponentProps => {
  switch (blok.component) {
    case ComponentType.Logos: {
      return getLogosProps(blok);
    }
    default:
      return null;
  }
};
