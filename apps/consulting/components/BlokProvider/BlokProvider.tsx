import React, { FC } from 'react';

import { Placeholder } from '@quansight/shared/ui-components';

import { getPropsByType } from './utils/getPropsByType';
import { componentsMap } from './componentsMap';

import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';

export type TBlokProviderProps = {
  blok: TRawBlok;
};

export const BlokProvider: FC<TBlokProviderProps> = ({ blok }) => {
  if (componentsMap[blok.component]) {
    const Component = componentsMap[blok.component];
    const componentProps = getPropsByType(blok);
    // @ts-expect-error TODO
    return <Component {...componentProps} />;
  }
  return <Placeholder componentName={blok ? blok.component : null} />;
};
