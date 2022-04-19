import { GetStaticPathsResult } from 'next/types';
import { ISlugParams, TLinkEntry } from '@quansight/shared/types';

export const getPaths = (
  items: TLinkEntry[] = [],
): GetStaticPathsResult<ISlugParams>['paths'] =>
  items
    .filter(
      ({ isFolder, slug }) =>
        !isFolder && slug !== 'homepage' && slug !== 'layout/footer',
    )
    .map(({ slug }) => ({
      params: {
        slug,
      },
    }));
