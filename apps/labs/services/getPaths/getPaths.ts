import { LinkEntry } from '@quansight/shared/storyblok-sdk';
import { GetStaticPathsResult } from 'next/types';
import { ISlugParams } from '../../types/graphql/slug';

export const getPaths = (
  items: LinkEntry[],
): GetStaticPathsResult<ISlugParams>['paths'] =>
  items
    .filter(({ isFolder, slug }) => !isFolder && slug !== 'home')
    .map(({ slug }) => ({
      params: {
        slug: slug as string,
      },
    }));
