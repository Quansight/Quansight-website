import { TTile, TTiles } from '../../types/storyblok/bloks/libraryProps';

export enum TileVariant {
  Library = 'library',
  Blog = 'blog',
}

export type TSlicedTiles = {
  sectionTop: TTiles;
  sectionBottom: TTiles;
};

export type TTilesProps = {
  tileVariant: TileVariant;
  tiles: TTiles;
};

export type TTileProps = { tileVariant: TileVariant } & TTile;
