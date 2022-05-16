import { ReactNode } from 'react';

import { TTile, TTiles, TLinkData } from '@quansight/shared/types';

export type TTilesProps = {
  tiles: TTiles;
};

export type TTileProps = TTile;

export type TLibraryLinkProps = {
  children: ReactNode;
  link: TLinkData;
};
