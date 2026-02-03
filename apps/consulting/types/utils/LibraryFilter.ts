import { TRawCategoryItem } from '../../services/posts/getAllCategories/types';

type TLibraryFilterItem = {
  key: string;
} & TRawCategoryItem;

export type TLibraryFilter = TLibraryFilterItem[];
