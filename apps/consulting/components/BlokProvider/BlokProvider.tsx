import React, { FC } from 'react';
import { getPropsByType } from './utils/getPropsByType';
import { componentsMap } from './componentsMap';

import Placeholder from '../Placeholder/Placeholder';

import { TBlokProviderProps } from './types';

export const BlokProvider: FC<TBlokProviderProps> = ({ blok }) => {
  if (componentsMap[blok.component]) {
    const Component = componentsMap[blok.component];
    const componentProps = getPropsByType(blok);
    return <Component {...componentProps} />;
  }
  return <Placeholder componentName={blok ? blok.component : null} />;
};
