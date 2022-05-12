import { TLibraryTile } from '@quansight/shared/types';

import { LinkType, TLinkData, LinkTarget } from '../types';
import { isLibraryLink, isArticle } from './determinateTileType';

export const getLinkType = (tile: TLibraryTile): TLinkData => {
  switch (tile.content.component) {
    case LinkType.Article:
      if (isArticle(tile))
        return {
          linkType: LinkTarget.Internal,
          linkUrl: `/${tile.full_slug}`,
        };
    case LinkType.LibraryLink:
      if (isLibraryLink(tile))
        return {
          linkType: LinkTarget.External,
          linkUrl: tile.content.resourceLink.url,
        };
    default:
      return { linkType: LinkTarget.Internal, linkUrl: '/' };
  }
};
