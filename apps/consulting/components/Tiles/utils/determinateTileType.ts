import { LibrarylinkItem, ArticleItem } from '@quansight/shared/storyblok-sdk';
import { TLibraryTile } from '@quansight/shared/types';

export const isLibraryLink = (tile: TLibraryTile): tile is LibrarylinkItem =>
  'resourceLink' in tile.content ? true : false;

export const isArticle = (tile: TLibraryTile): tile is ArticleItem =>
  tile.content.component === 'article' ? true : false;
