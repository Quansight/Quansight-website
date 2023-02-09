import { isSlugRestricted } from './isSlugRestricted';
import { TGetPaths } from './types';

export const getPaths = <LinkEntry extends { isFolder: boolean; slug: string }>(
  items: LinkEntry[],
): TGetPaths[] =>
  items
    .filter(
      ({ isFolder, slug }) => slug && !isFolder && !isSlugRestricted(slug),
    )
    .map(({ slug }) => ({
      params: {
        slug,
      },
    }));
