import { FC } from 'react';

import { useRouter } from 'next/router';

import { FilterMenuVariant } from '../../types/utils/FilterMenuVariant';
import { FilterMenu } from './FilterMenu/FilterMenu';
import { TFiltersProps, FilterMenuOption } from './types';
import { getFilterValue } from './utils/getFilterValue';

export const Filters: FC<TFiltersProps> = ({
  postTypes,
  postCategories,
  postFilters,
  onFiltersChange,
  onPageChange,
}) => {
  const router = useRouter();

  const onFilterChange = (
    filter: string,
    filterVariant: FilterMenuVariant,
  ): void => {
    const isTheSameFilter = filter === postFilters[filterVariant];
    if (isTheSameFilter) return;
    onFiltersChange((prevState) => ({
      ...prevState,
      ...getFilterValue(filter, filterVariant, FilterMenuOption.State),
    }));
    onPageChange(1);
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page: 1,
          ...getFilterValue(filter, filterVariant, FilterMenuOption.Query),
        },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <div className="flex flex-col gap-[2rem] justify-between items-center pb-[5.2rem] w-full sm:flex-row sm:gap-[5rem]">
      {/*
      We're removing the type filter until we have content of other types. Right now, we just have blog-type content.
      <FilterMenu
        filterMenuVariant={FilterMenuVariant.Type}
        menuDataCurrent={postFilters.type}
        menuData={postTypes}
        onFilterChange={onFilterChange}
      />
      */}
      <FilterMenu
        filterMenuVariant={FilterMenuVariant.Category}
        menuDataCurrent={postFilters.category}
        menuData={postCategories}
        onFilterChange={onFilterChange}
      />
    </div>
  );
};
