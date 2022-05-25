import { TLibraryTileRawData } from '../types';

export const convertToDate = (tile: TLibraryTileRawData): number =>
  tile?.content?.publishedDate
    ? new Date(tile?.content?.publishedDate).getTime()
    : new Date().getTime();
