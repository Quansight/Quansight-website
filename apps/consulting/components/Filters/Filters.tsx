import { FC } from 'react';

import { FilterCategories } from './FilterCategories/FilterCategories';
import { FilterTypes } from './FilterTypes/FilterTypes';
import { TFiltersProps } from './types';

export const Filters: FC<TFiltersProps> = ({
  postType,
  postTypes,
  setPostType,
  postCategory,
  postCategories,
  setPostCategory,
}) => {
  return (
    <div className="flex justify-between items-center w-full">
      <FilterTypes
        postType={postType}
        setPostType={setPostType}
        postTypes={postTypes}
      />
      <FilterCategories
        postCategory={postCategory}
        setPostCategory={setPostCategory}
        postCategories={postCategories}
      />
    </div>
  );
};
