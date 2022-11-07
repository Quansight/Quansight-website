import { TLocalCategories } from '..';
import { DatasourceEntry } from '../../../api/types/basic';

export type TValidateCategoriesArrayProps = TLocalCategories | DatasourceEntry;

export type TGetLibraryCategoriesProps = {
  localCategories: TLocalCategories;
  remoteCategories: DatasourceEntry[];
};
