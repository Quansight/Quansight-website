import { TLinkData, LinkTarget } from '@quansight/shared/types';

import { TLibraryTileRawData } from '../types';
import { isLibraryLink, isArticle } from './determinateTileType';

export const getLinkType = (tile: TLibraryTileRawData): TLinkData => {
  if (isArticle(tile))
    return {
      linkType: LinkTarget.Internal,
      linkUrl: `/${tile.full_slug}`,
    };
  if (isLibraryLink(tile))
    return {
      linkType: LinkTarget.External,
      linkUrl: tile.content.resourceLink.url,
    };
  return { linkType: LinkTarget.Internal, linkUrl: '/' };
};
