import { isSlugRestricted } from './isSlugRestricted';
import { TGetPaths } from './types';

export const getPaths = <
  LinkEntry extends { isFolder: boolean; slug: string; parentId: number },
>(
  items: LinkEntry[],
): TGetPaths[] =>
  items
    .filter(
      ({ isFolder, slug, parentId }) =>
        slug && !isFolder && !parentId && !isSlugRestricted(slug),
    )
    .map(({ slug }) => ({
      params: {
        slug,
      },
    }));
