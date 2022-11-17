import { TGetLibraryCategoriesProps } from './types';
import { validateCategoriesArray } from './utils/validateCategoriesArray';

export const getLibraryCategories = ({
  localCategories = [],
  remoteCategories = [],
}: TGetLibraryCategoriesProps) => {
  const validLocalCategories = validateCategoriesArray(localCategories);
  const validRemoteCategories = validateCategoriesArray(remoteCategories);

  return [...validLocalCategories, ...validRemoteCategories]
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
