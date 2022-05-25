import { LibrarylinkItem, ArticleItem } from '@quansight/shared/storyblok-sdk';

import { TLibraryTileRawData } from '../types';

export const isLibraryLink = (
  tile: TLibraryTileRawData,
): tile is LibrarylinkItem => 'resourceLink' in tile.content;

export const isArticle = (tile: TLibraryTileRawData): tile is ArticleItem =>
  tile.content.component === 'article';
