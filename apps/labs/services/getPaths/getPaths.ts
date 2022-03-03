import { GetStaticPathsResult } from 'next/types';
import { ISlugParams } from '../../types/graphql/slug';
import { TLinkEntry } from '../../types/graphql/links';

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
