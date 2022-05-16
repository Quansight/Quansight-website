import { ReactNode } from 'react';

import { TLibraryTiles, TLibraryTile } from '@quansight/shared/types';

export type TTilesProps = {
  tiles: TLibraryTiles;
};

export type TTileProps = {
  tile: TLibraryTile;
};

export type TTileData = {
  imageSrc: string;
  imageAlt: string;
  postType: string;
  title: string;
  author: string;
  date: string;
  link: TLinkData;
};

export enum LinkTarget {
  Internal = 'internal',
  External = 'external',
}

export type TLinkData = {
  linkType: string;
  linkUrl: string;
};

export type TLibraryLinkProps = {
  children: ReactNode;
  link: TLinkData;
};
