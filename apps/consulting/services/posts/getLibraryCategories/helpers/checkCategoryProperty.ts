import { isValidString } from './isValidType';
import { trimWhiteSpace, removeWhiteSpace } from './stringHelpers';

export const checkCategoryName = (name: string) =>
  isValidString(name) && trimWhiteSpace(name).length === name.length
    ? name
    : false;

export const checkCategoryValue = (name: string) =>
  isValidString(name) && removeWhiteSpace(name).length === name.length
    ? name
    : false;
