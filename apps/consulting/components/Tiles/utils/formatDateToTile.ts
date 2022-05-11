import { TLibraryTile } from '@quansight/shared/types';

export const formatDateToTile = (tile: TLibraryTile): string => {
  const rawDate = new Date(tile.content.publishedDate);
  const date = {
    day: rawDate.getDate(),
    month: rawDate.toLocaleString('default', { month: 'long' }),
    year: rawDate.getFullYear(),
  };
  return `${date.month} ${date.day}, ${date.year}`;
};
