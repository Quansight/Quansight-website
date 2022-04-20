import { TLinkEntry } from '@quansight/shared/types';
import { isSlugRestricted } from './isSlugRestricted';
import { TGetPaths } from './types';

export const getPaths = (items: TLinkEntry[]): TGetPaths[] =>
  items
    .filter(({ isFolder, slug }) => slug && !isFolder && isSlugRestricted(slug))
    .map(({ slug }) => ({
      params: {
        slug,
      },
    }));
