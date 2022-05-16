import { TLibraryTileRawData } from '../types';

export const getAuthorFullName = (tile: TLibraryTileRawData): string =>
  `${tile.content.author.content.firstName} ${tile.content.author.content.lastName}`;
