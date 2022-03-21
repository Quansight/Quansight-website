import { ComponentType, TBlokComponentProps, TLabsBlok } from '../types';

import { getLogosProps } from '../mappers/getLogosProps';

import { TLogosProps } from '../../Logos/Logos';

export const getPropsByType = (blok: TLabsBlok): TBlokComponentProps => {
  return (
    {
      [ComponentType.Logos]: getLogosProps(blok as TLabsBlok<TLogosProps>),
    }[blok.component] || null
  );
};
