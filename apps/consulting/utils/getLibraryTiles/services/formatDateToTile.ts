import { TLibraryTileRawData } from '../types';

export const formatDateToTile = (tile: TLibraryTileRawData): string => {
  const rawDate = new Date(tile.content.publishedDate);
  const date = {
    day: rawDate.getDate(),
    month: rawDate.toLocaleString('default', { month: 'long' }),
    year: rawDate.getFullYear(),
  };
  return `${date.month} ${date.day}, ${date.year}`;
};
