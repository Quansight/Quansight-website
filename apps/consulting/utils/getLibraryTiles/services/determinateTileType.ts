import { LibrarylinkItem, PageItem } from '../../../api/types/basic';
import { TLibraryTileRawData } from '../types';

export const isLibraryLink = (
  tile: TLibraryTileRawData,
): tile is LibrarylinkItem => 'resourceLink' in tile.content;

export const isBlogArticle = (tile: TLibraryTileRawData): tile is PageItem =>
  tile.content.component === 'page';
