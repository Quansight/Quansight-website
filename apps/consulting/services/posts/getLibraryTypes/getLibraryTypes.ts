import { isValidArray, isValidObject } from '@quansight/shared/utils';

import { getDataSourceEntries } from '../../../api/utils/getDataSourceEntries';
import { TLibraryFilter } from '../../../types/utils/LibraryFilter';

export const getLibraryTypes = async (
  preview: boolean,
): Promise<TLibraryFilter> => {
  const datasourceTypes = await getDataSourceEntries(
    { slug: 'post-type' },
    preview,
  );

  if (isValidArray(datasourceTypes?.items)) {
    return datasourceTypes?.items
      .filter((typeItem) => isValidObject(typeItem))
      .map(({ name, value }, index) => ({
        name,
        value,
        key: `${value}-${index}`,
      }));
  }

  return [];
};
