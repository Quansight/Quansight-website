import { TTile } from '../../types/storyblok/bloks/libraryProps';
import { formatDateToTile } from './services/formatDateToTile';
import { getAuthorFullName } from './services/getAuthorFullName';
import { getLinkType } from './services/getLinkType';
import { TLibraryTileRawData } from './types';

export const getTileProps = (tile: TLibraryTileRawData): TTile => ({
  imageSrc: tile.content.postImage.filename,
  imageAlt: tile.content.postImage.alt,
  postType: tile.content.type,
  title: tile.content.postTitle,
  author: getAuthorFullName(tile),
  date: formatDateToTile(tile),
  link: getLinkType(tile),
  uuid: tile.uuid,
});
