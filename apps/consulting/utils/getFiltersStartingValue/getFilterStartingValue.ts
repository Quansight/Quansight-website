import { FilterMenuVariant } from './types';

const TYPES_STARTING_VALUE = 'all';
const CATEGORIES_STARTING_VALUE = 'all categories';

export const getFilterStartingValue = (variant: FilterMenuVariant): string =>
  variant === FilterMenuVariant.Types
    ? TYPES_STARTING_VALUE
    : CATEGORIES_STARTING_VALUE;
