import { Dispatch, SetStateAction } from 'react';

import { Maybe } from 'graphql/jsutils/Maybe';

import { DatasourceEntries } from '../../api/types/basic';

export type TFilterTypesProps = {
  postTypes: DatasourceEntries;
  postType: Maybe<string>;
  setPostType: Dispatch<SetStateAction<string | undefined>>;
};
export type TFilterCategoriesProps = {
  postCategories: DatasourceEntries;
  postCategory: Maybe<string>;
  setPostCategory: Dispatch<SetStateAction<string | undefined>>;
};

export type TFiltersProps = TFilterTypesProps & TFilterCategoriesProps;
