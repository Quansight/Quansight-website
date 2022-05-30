import { TTile } from '../../types/storyblok/bloks/libraryProps';
import { formatArticleDate } from '../formatArticleDate/formatArticleDate';
import { getAuthorName } from '../getAuthorName/getAuthorName';
import { getLinkType } from './services/getLinkType';
import { TLibraryTileRawData } from './types';

export const getTileProps = (tile: TLibraryTileRawData): TTile => ({
  imageSrc: tile.content.postImage.filename,
  imageAlt: tile.content.postImage.alt,
  postType: tile.content.type,
  postCategory: tile.content.category,
  title: tile.content.postTitle,
  author: getAuthorName(
    tile.content.author.content.firstName,
    tile.content.author.content.lastName,
  ),
  date: formatArticleDate(tile.content.publishedDate),
  link: getLinkType(tile),
  uuid: tile.uuid,
});
