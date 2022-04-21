import { TRawBlok } from '../../../types/storyblok/bloks/rawBlock';
import { getLogosProps } from '../mappers/getLogosProps';
import { ComponentType, TBlokComponentProps } from '../types';

export const getPropsByType = (blok: TRawBlok): TBlokComponentProps => {
  switch (blok.component) {
    case ComponentType.Logos: {
      return getLogosProps(blok);
    }
    default:
      return null;
  }
};
