import { TLinkEntry } from '@quansight/shared/types';

import { formatSlugParam } from './formatSlugParam';
import { isSlugRestricted } from './isSlugRestricted';
import { TGetArticlesPaths } from './types';

export const getArticlesPaths = (items: TLinkEntry[]): TGetArticlesPaths[] =>
  items
    .filter(({ isFolder, slug }) => slug && !isFolder && isSlugRestricted(slug))
    .map(({ slug }) => ({
      params: {
        slug: formatSlugParam(slug),
      },
    }));
