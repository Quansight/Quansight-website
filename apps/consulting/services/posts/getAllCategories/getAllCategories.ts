import { getDataSourceEntries } from '../../../api/utils/getDataSourceEntries';
import { TLibraryFilter } from '../../../types/utils/LibraryFilter';
import { getLocalCategories } from './utils/getLocalCategories';
import { getValidCategoriesArray } from './utils/getValidCategoriesArray';

export const getAllCategories = async (
  preview: boolean,
): Promise<TLibraryFilter> => {
  const localCategories = await getLocalCategories();
  const datasourceCategories = await getDataSourceEntries(
    { slug: 'post-category' },
    preview,
  );

  return [
    ...getValidCategoriesArray(localCategories),
    ...getValidCategoriesArray(datasourceCategories?.items),
  ]
    .filter(
      ({ name: currentName, value: currentValue }, index, validCategories) =>
        index ===
        validCategories.findIndex(
          ({ name: allCategoriesName, value: allCategoriesValue }) =>
            allCategoriesName === currentName &&
            allCategoriesValue === currentValue,
        ),
    )
    .map(({ name, value }, index) => ({
      name,
      value,
      key: `${value}-${index}`,
    }))
    .sort(({ name: nameOne }, { name: nameTwo }) => {
      const nameOneUpperCase = nameOne.toUpperCase();
      const nameTwoUpperCase = nameTwo.toUpperCase();
      return nameOneUpperCase < nameTwoUpperCase
        ? -1
        : nameOneUpperCase > nameTwoUpperCase
        ? 1
        : 0;
    });
};
