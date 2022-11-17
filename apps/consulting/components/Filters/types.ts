import { Dispatch, SetStateAction } from 'react';

import { Maybe } from 'graphql/jsutils/Maybe';

import { FilterMenuVariant } from '../../types/utils/FilterMenuVariant';
import { TLibraryFilter } from '../../types/utils/LibraryFilter';

export enum FilterMenuOption {
  State = 'state',
  Query = 'query',
}

export type TFilterMenuItemProps = {
  menuDataItemName: string;
  menuDataItemValue: string;
  menuDataCurrent: Maybe<string>;
  onFilterChange: (filter: string) => void;
};

export type TFilterMenuProps = {
  menuData: TLibraryFilter;
  menuDataCurrent: Maybe<string>;
  filterMenuVariant: FilterMenuVariant;
  onFilterChange: (filter: string, filterVariant: FilterMenuVariant) => void;
};

type postFilters = {
  [key: string]: string;
};

export type TFiltersProps = {
  libraryTypes: TLibraryFilter;
  libraryCategories: TLibraryFilter;
  postFilters: postFilters;
  onFiltersChange: Dispatch<SetStateAction<postFilters>>;
  onPageChange: Dispatch<SetStateAction<number>>;
};
