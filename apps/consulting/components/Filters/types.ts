import { Dispatch, SetStateAction } from 'react';

import { Maybe } from 'graphql/jsutils/Maybe';

import { DatasourceEntries } from '../../api/types/basic';

export enum FilterMenuVariant {
  Types = 'types',
  Categories = 'categories',
}

export type TMenuItemData = {
  menuDataCurrent: Maybe<string>;
};
export type TFilterMenuItemProps = {
  menuDataItem: string;
  handleClick: (value: string) => void;
} & TMenuItemData;

export type TFilterMenuProps = {
  menuData: DatasourceEntries;
  filterMenuVariant: FilterMenuVariant;
  setMenuItem: Dispatch<SetStateAction<string>>;
} & TMenuItemData;

export type TFiltersProps = {
  postType: Maybe<string>;
  setPostType: Dispatch<SetStateAction<string>>;
  postTypes: DatasourceEntries;
  postCategory: string;
  setPostCategory: Dispatch<SetStateAction<string>>;
  postCategories: DatasourceEntries;
};
