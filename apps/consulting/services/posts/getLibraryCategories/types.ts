import { DatasourceEntry } from '../../../api/types/basic';

type TCategoryItem = {
  name: string;
  value: string;
};

export type TLocalCategories = TCategoryItem[];

export type TValidateCategoriesArrayProps =
  | TLocalCategories
  | DatasourceEntry[];

export type TGetLibraryCategoriesProps = {
  localCategories: TLocalCategories;
  remoteCategories: DatasourceEntry[];
};
