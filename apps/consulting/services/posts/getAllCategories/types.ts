import { DatasourceEntry } from '../../../api/types/basic';

export type TRawCategoryItem = {
  name: string;
  value: string;
};

export type TLocalCategories = TRawCategoryItem[];
export type TRemoteCategories = DatasourceEntry[];

export type TValidateCategoriesArrayProps =
  | TLocalCategories
  | TRemoteCategories;

export type TGetLibraryCategoriesProps = {
  localCategories: TLocalCategories;
  remoteCategories: TRemoteCategories;
};
