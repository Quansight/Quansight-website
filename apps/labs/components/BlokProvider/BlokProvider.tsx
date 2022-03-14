import React, { FC } from 'react';
import Placeholder from '../Placeholder/Placeholder';
import { getPropsByType } from './utils/getPropsByType';
import { componentsMap } from './componentsMap';
import { TLabsBlok } from './types';

export type TBlokProviderProps = {
  blok: TLabsBlok;
};

export const BlokProvider: FC<TBlokProviderProps> = ({ blok }) => {
  if (componentsMap[blok.component]) {
    const Component = componentsMap[blok.component];
    const componentProps = getPropsByType(blok);
    return <Component {...componentProps} />;
  }
  return <Placeholder componentName={blok ? blok.component : null} />;
};
