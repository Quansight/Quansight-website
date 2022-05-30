import { Dispatch, SetStateAction } from 'react';

import { Maybe } from 'graphql/jsutils/Maybe';

import { DatasourceEntries } from '../../api/types/basic';
import { FilterMenuVariant } from '../../utils/getFiltersStartingValue/types';

export type TMenuItemData = {
  menuDataCurrent: Maybe<string>;
};
export type TFilterMenuItemProps = {
  handleClick: (menuDataItem: string) => void;
  menuDataItem: string;
} & TMenuItemData;

export type TFilterMenuProps = {
  menuData: DatasourceEntries;
  filterMenuVariant: FilterMenuVariant;
  handleFilter: (value: string) => void;
} & TMenuItemData;

export type TFiltersProps = {
  postType: Maybe<string>;
  setPostType: Dispatch<SetStateAction<string>>;
  postTypes: DatasourceEntries;
  postCategory: string;
  setPostCategory: Dispatch<SetStateAction<string>>;
  postCategories: DatasourceEntries;
  setCurrentPage: Dispatch<SetStateAction<number>>;
};
