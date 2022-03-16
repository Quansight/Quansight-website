import React, { FC } from 'react';
import { Placeholder } from '@quansight/shared/ui-components';
import { getPropsByType } from './utils/getPropsByType';
import { componentsMap } from './componentsMap';
import { TConsultingBlok } from './types';

export type TBlokProviderProps = {
  blok: TConsultingBlok;
};

export const BlokProvider: FC<TBlokProviderProps> = ({ blok }) => {
  if (componentsMap[blok.component]) {
    const Component = componentsMap[blok.component];
    const componentProps = getPropsByType(blok);
    return <Component {...componentProps} />;
  }
  return <Placeholder componentName={blok ? blok.component : null} />;
};
