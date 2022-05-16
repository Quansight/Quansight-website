import { TLibraryTile } from '@quansight/shared/types';

import { TTileData } from '../types';
import { formatDateToTile } from './formatDateToTile';
import { getAuthorFullName } from './getAuthorFullName';
import { getLinkType } from './getLinkType';

export const getTileProps = (tile: TLibraryTile): TTileData => ({
  imageSrc: tile.content.postImage.filename,
  imageAlt: tile.content.postImage.alt,
  postType: tile.content.type,
  title: tile.content.postTitle,
  author: getAuthorFullName(tile),
  date: formatDateToTile(tile),
  link: getLinkType(tile),
});
