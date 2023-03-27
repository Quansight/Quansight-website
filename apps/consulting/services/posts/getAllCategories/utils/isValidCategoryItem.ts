import {
  isValidObject,
  isValidString,
  trimWhiteSpace,
  removeWhiteSpace,
} from '@quansight/shared/utils';

import { TRawCategoryItem } from '../types';

const checkCategoryName = (name: string) =>
  trimWhiteSpace(name).length === name.length ? name : false;

const checkCategoryValue = (name: string) =>
  removeWhiteSpace(name).length === name.length ? name : false;

const categorySchema = {
  name: checkCategoryName,
  value: checkCategoryValue,
};

export const isValidCategoryItem = (categoryItem: TRawCategoryItem): boolean =>
  isValidObject(categoryItem) &&
  Object.keys(categorySchema).filter((schemaKey) => {
    const categoryItemProperty = categoryItem[schemaKey];

    if (
      !isValidString(categoryItemProperty) ||
      !categorySchema[schemaKey](categoryItemProperty)
    )
      return true;
  }).length === 0;
