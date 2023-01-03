import { isValidArray, isValidObject } from '@quansight/shared/utils';

import { getDataSourceEntries } from '../../../api/utils/getDataSourceEntries';
import { TLibraryFilter } from '../../../types/utils/LibraryFilter';
import { initialBlogType } from './initialBlogType';

export const getLibraryTypes = async (
  preview: boolean,
): Promise<TLibraryFilter> => {
  const datasourceTypes = await getDataSourceEntries(
    { slug: 'post-type' },
    preview,
  );

  if (isValidArray(datasourceTypes?.items)) {
    return [...datasourceTypes?.items, initialBlogType]
      .filter((typeItem) => isValidObject(typeItem))
      .map(({ name, value }) => ({
        name,
        value,
        key: `${name}-${value}`,
      }));
  }

  return [];
};
