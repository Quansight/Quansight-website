import { ComponentType, TBlokComponentProps } from '../types';
import { getBoardProps } from '../mappers/getBoardProps';
import { getHeroProps } from '../mappers/getHeroProps';

import { TRawBlok } from '../../../types/storyblok/bloks/rawBlok';

export const getPropsByType = (blok: TRawBlok): TBlokComponentProps => {
  switch (blok.component) {
    case ComponentType.Hero: {
      return getHeroProps(blok);
    }
    case ComponentType.Board: {
      return getBoardProps(blok);
    }
    default:
      return null;
  }
};
