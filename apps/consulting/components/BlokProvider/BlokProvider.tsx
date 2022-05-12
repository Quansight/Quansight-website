import React, { FC } from 'react';

import { PersonItems } from '@quansight/shared/storyblok-sdk';
import { Placeholder } from '@quansight/shared/ui-components';

import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';
import { componentsMap } from './componentsMap';
import { getPropsByType } from './utils/getPropsByType';

export type TBlokProviderProps = {
  blok: TRawBlok;
  team?: PersonItems;
};

export const BlokProvider: FC<TBlokProviderProps> = ({ blok, team }) => {
  if (componentsMap[blok.component]) {
    const Component = componentsMap[blok.component];
    const componentProps = getPropsByType(blok, team);

    // @ts-ignore TODO
    return <Component {...componentProps} />;
  }
  return <Placeholder componentName={blok ? blok.component : null} />;
};
