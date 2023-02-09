import { TLinkEntry } from '@quansight/shared/types';

import { LinkEntry } from '../../api/types/basic';
import { formatSlugParam } from './formatSlugParam';
import { isSlugForPost } from './isSlugForPost';
import { TGetArticlesPaths } from './types';

export const getArticlesPaths = (
  items: TLinkEntry<LinkEntry>[],
): TGetArticlesPaths[] =>
  items
    .filter(({ isFolder, slug }) => slug && !isFolder && isSlugForPost(slug))
    .map(({ slug }) => ({
      params: {
        slug: formatSlugParam(slug),
      },
    }));
