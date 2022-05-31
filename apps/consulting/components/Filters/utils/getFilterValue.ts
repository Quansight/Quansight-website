import { FilterMenuVariant } from '../../../types/utils/FilterMenuVariant';
import { FilterMenuOption } from '../types';
import { getFilterStartingValue } from './getFilterStartingValue';

export const getFilterValue = (
  filterValue: string,
  variant: FilterMenuVariant,
  option: FilterMenuOption,
): { [key: string]: string } => {
  const filterQuery = {};
  const strtingValue = getFilterStartingValue(variant);
  filterQuery[variant] =
    filterValue === strtingValue
      ? option === FilterMenuOption.State
        ? strtingValue
        : ''
      : filterValue;
  return filterQuery;
};
