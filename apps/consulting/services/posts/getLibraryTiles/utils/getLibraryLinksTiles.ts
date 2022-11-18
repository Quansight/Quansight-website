import { LibrarylinkItems } from '../../../../api/types/basic';
import { TTiles } from '../../../../types/storyblok/bloks/libraryProps';
import { LinkTarget } from '../../../../types/storyblok/bloks/libraryProps';
import { formatArticleDate } from './formatArticleDate';
import { getAuthorName } from './getAuthorName';

export const getLibraryLinksTiles = (libraryLinks: LibrarylinkItems): TTiles =>
  libraryLinks.items.map((libraryLink) => ({
    imageSrc: libraryLink.content.postImage.filename,
    imageAlt: libraryLink.content.postImage.alt,
    postType: libraryLink.content.type,
    postCategory: libraryLink.content.category,
    title: libraryLink.content.postTitle,
    author: getAuthorName(
      libraryLink.content.author.content.firstName,
      libraryLink.content.author.content.lastName,
    ),
    date: formatArticleDate(libraryLink.content.publishedDate),
    link: {
      linkUrl: libraryLink.content.resourceLink.url,
      linkType: LinkTarget.External,
    },
    key: libraryLink.uuid,
  }));
