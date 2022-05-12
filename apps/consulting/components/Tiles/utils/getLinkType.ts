import { LibrarylinkItem, ArticleItem } from '@quansight/shared/storyblok-sdk';
import { TLibraryTile } from '@quansight/shared/types';

import { LinkType, TLinkData, LinkTarget } from '../types';

export const getLinkType = (tile: TLibraryTile): TLinkData => {
  switch (tile.content.component) {
    case LinkType.Article:
      const articleTile = tile as ArticleItem;
      return {
        linkType: LinkTarget.Internal,
        linkUrl: `/${articleTile.full_slug}`,
      };
    case LinkType.LibraryLink:
      const libraryLinkTile = tile as LibrarylinkItem;
      return {
        linkType: LinkTarget.External,
        linkUrl: libraryLinkTile.content.resourceLink.url,
      };
    default:
      return { linkType: LinkTarget.Internal, linkUrl: '/' };
  }
};
