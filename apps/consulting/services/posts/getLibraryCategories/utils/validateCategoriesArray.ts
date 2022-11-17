import {
  checkCategoryName,
  checkCategoryValue,
} from '../helpers/checkCategoryProperty';
import { isValidArray, isValidObject } from '../helpers/isValidType';
import { TValidateCategoriesArrayProps } from '../types';

export const validateCategoriesArray = (
  categoriesRawData: TValidateCategoriesArrayProps,
) => {
  if (isValidArray(categoriesRawData)) {
    return categoriesRawData.filter(
      (categoryItem) =>
        isValidObject(categoryItem) &&
        checkCategoryName(categoryItem.name) &&
        checkCategoryValue(categoryItem.value),
    );
  }
  return [];
};
