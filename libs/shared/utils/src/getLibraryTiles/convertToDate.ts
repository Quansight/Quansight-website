import { TLibraryTile } from '@quansight/shared/types';

export const convertToDate = (tileItem: TLibraryTile): number =>
  tileItem?.content?.publishedDate
    ? new Date(tileItem?.content?.publishedDate).getTime()
    : new Date().getTime();
