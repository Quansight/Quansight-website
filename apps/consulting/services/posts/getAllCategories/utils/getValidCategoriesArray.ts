import { isValidArray } from '@quansight/shared/utils';

import { TValidateCategoriesArrayProps } from '../types';
import { isValidCategoryItem } from './isValidCategoryItem';

export const getValidCategoriesArray = (
  categoriesRawData: TValidateCategoriesArrayProps,
) => {
  if (isValidArray(categoriesRawData)) {
    return categoriesRawData.filter((categoryItem) =>
      isValidCategoryItem(categoryItem),
    );
  }
  return [];
};
