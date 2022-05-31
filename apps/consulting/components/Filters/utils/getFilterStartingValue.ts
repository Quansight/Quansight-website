import { FilterMenuVariant } from '../../../types/utils/FilterMenuVariant';
import { TYPES_STARTING_VALUE, CATEGORIES_STARTING_VALUE } from '../constants';

export const getFilterStartingValue = (variant: FilterMenuVariant): string =>
  variant === FilterMenuVariant.Type
    ? TYPES_STARTING_VALUE
    : CATEGORIES_STARTING_VALUE;
