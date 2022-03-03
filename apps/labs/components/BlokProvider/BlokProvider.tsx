import React, { FC } from 'react';
import Placeholder from '../Placeholder/Placeholder';
import { TBlok } from '../../types/storyblok/blok';
import { blokMap } from '../../constants/blokMap';
import { getPropsByType } from '../../services/getPropsByType/getPropsByType';

export type TBlokProviderProps = {
  blok: TBlok;
};

export const BlokProvider: FC<TBlokProviderProps> = ({ blok }) => {
  if (blokMap[blok.component]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO
    const Component = blokMap[blok.component];
    const componentProps = getPropsByType(blok);
    return <Component {...componentProps} />;
  }
  return <Placeholder componentName={blok ? blok.component : null} />;
};
