import { Dispatch, SetStateAction } from 'react';

import { Maybe } from 'graphql/jsutils/Maybe';

import { DatasourceEntries } from '../../api/types/basic';
import { FilterMenuVariant } from '../../types/utils/FilterMenuVariant';

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
  menuData: { name: string; value: string; key: string }[];
  menuDataCurrent: Maybe<string>;
  filterMenuVariant: FilterMenuVariant;
  onFilterChange: (filter: string, filterVariant: FilterMenuVariant) => void;
};

type postFilters = {
  [key: string]: string;
};

export type TFiltersProps = {
  postTypes: DatasourceEntries;
  libraryCategories: { name: string; value: string; key: string }[];
  postFilters: postFilters;
  onFiltersChange: Dispatch<SetStateAction<postFilters>>;
  onPageChange: Dispatch<SetStateAction<number>>;
};
