import { FC } from 'react';

import { FilterMenu } from './FilterMenu/FilterMenu';
import { TFiltersProps } from './types';
import { FilterMenuVariant } from './types';

export const Filters: FC<TFiltersProps> = ({
  postType,
  postTypes,
  setPostType,
  postCategory,
  postCategories,
  setPostCategory,
}) => {
  return (
    <div className="flex flex-col gap-[2rem] justify-between items-center pb-[5.2rem] w-full sm:flex-row sm:gap-[5rem]">
      <FilterMenu
        filterMenuVariant={FilterMenuVariant.Types}
        menuDataCurrent={postType}
        setMenuItem={setPostType}
        menuData={postTypes}
      />
      <FilterMenu
        filterMenuVariant={FilterMenuVariant.Categories}
        menuDataCurrent={postCategory}
        setMenuItem={setPostCategory}
        menuData={postCategories}
      />
    </div>
  );
};
