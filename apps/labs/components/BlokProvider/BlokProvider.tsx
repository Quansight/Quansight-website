import React, { FC } from 'react';

import { getPropsByType } from './utils/getPropsByType';
import { componentsMap } from './componentsMap';

import { TRawBlok } from '../../types/storyblok/bloks/rawBlock';

import { Placeholder } from '@quansight/shared/ui-components';

export type TBlokProviderProps = {
  blok: TRawBlok;
};

export const BlokProvider: FC<TBlokProviderProps> = ({ blok }) => {
  if (componentsMap[blok.component]) {
    const Component = componentsMap[blok.component];
    const componentProps = getPropsByType(blok);
    // @ts-ignore TODO
    return <Component {...componentProps} />;
  }
  return <Placeholder componentName={blok ? blok.component : null} />;
};
