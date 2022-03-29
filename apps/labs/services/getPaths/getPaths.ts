import { GetStaticPathsResult } from 'next/types';
import { ISlugParams, TLinkEntry } from '@quansight/shared/types';

export const getPaths = (
  items: TLinkEntry[] = [],
): GetStaticPathsResult<ISlugParams>['paths'] =>
  items
    .filter(({ isFolder, slug }) => !isFolder && slug !== 'home')
    .map(({ slug }) => ({
      params: {
        slug,
      },
    }));
