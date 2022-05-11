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
};
