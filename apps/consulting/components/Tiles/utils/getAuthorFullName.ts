import { TLibraryTile } from '@quansight/shared/types';

export const getAuthorFullName = (tile: TLibraryTile): string =>
  `${tile.content.author.content.firstName} ${tile.content.author.content.lastName}`;
