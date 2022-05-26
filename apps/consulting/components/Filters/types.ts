import { Dispatch, SetStateAction } from 'react';

import { Maybe } from 'graphql/jsutils/Maybe';

import { DatasourceEntries } from '../../api/types/basic';

export enum FilterMenuVariant {
  Types = 'types',
  Categories = 'categories',
}

export type TMenuItemData = {
  menuDataCurrent: Maybe<string>;
  handleFilter: (value: string) => void;
};
export type TFilterMenuItemProps = {
  menuDataItem: string;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
} & TMenuItemData;

export type TFilterMenuProps = {
  menuData: DatasourceEntries;
  filterMenuVariant: FilterMenuVariant;
} & TMenuItemData;

export type TFiltersProps = {
  postType: Maybe<string>;
  setPostType: Dispatch<SetStateAction<string>>;
  postTypes: DatasourceEntries;
  postCategory: string;
  setPostCategory: Dispatch<SetStateAction<string>>;
  postCategories: DatasourceEntries;
};
