import { FC, useState, useEffect, useRef } from 'react';

import clsx from 'clsx';

import { FilterMenuVariant } from '../../../types/utils/FilterMenuVariant';
import { TFilterMenuProps } from '../types';
import { getFilterStartingValue } from '../utils/getFilterStartingValue';
import { FilterMenuItem } from './FilterMenuItem';

export const FilterMenu: FC<TFilterMenuProps> = ({
  filterMenuVariant,
  menuData,
  menuDataCurrent,
  onFilterChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  const handleFilterChange = (menuDataItem: string): void => {
    setIsDropdownOpen(false);
    onFilterChange(menuDataItem, filterMenuVariant);
  };

  useEffect(() => {
    const handleFocusClose = ({ target }: MouseEvent): void => {
      if (container.current && !container.current.contains(target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('focusin', handleFocusClose);
      return () => {
        document.removeEventListener('focusin', handleFocusClose);
      };
    }

    return;
  }, [isDropdownOpen]);

  return (
    <div
      ref={container}
      className={clsx(
        'w-full',
        filterMenuVariant === FilterMenuVariant.Category && 'sm:max-w-fit',
      )}
    >
      <button
        aria-label="Select filter"
        aria-expanded={isDropdownOpen}
        aria-controls="filters"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={clsx(
          'relative py-[0.8rem] px-[1.2rem] w-full text-[1.4rem]  font-normal leading-[3rem] text-center uppercase bg-gray-200 border-2 border-gray-300 sm:w-[26rem]',
          isDropdownOpen ? 'border-b-transparent' : 'border-b-gray-300',
          filterMenuVariant === FilterMenuVariant.Type
            ? 'sm:hidden'
            : 'sm:flex sm:gap-0 sm:justify-between sm:items-center',
        )}
      >
        {menuDataCurrent}
        <span
          className={clsx(
            'inline-block absolute top-1/2 right-[1rem] w-0 h-0 border-x-8 border-t-8 border-x-transparent translate-y-[-50%] border-x-solid border-l-solid',
            isDropdownOpen
              ? '-rotate-180 border-violet'
              : 'border-gray-300 rotate-0',
            filterMenuVariant === FilterMenuVariant.Category &&
              'sm:relative sm:top-0 sm:right-0 sm:translate-y-none',
          )}
        />
      </button>
      <div className="relative w-full">
        <ul
          id="filters"
          className={clsx(
            'absolute top-[-.2rem] z-20 px-[1.2rem] pb-[0.8rem] w-full bg-gray-200 border-x-2 border-b-2 border-gray-300',
            isDropdownOpen
              ? 'block'
              : filterMenuVariant === FilterMenuVariant.Type
              ? 'hidden sm:block sm:relative'
              : 'hidden',
            filterMenuVariant === FilterMenuVariant.Type &&
              'sm:flex sm:gap-[2rem] sm:justify-start sm:items-center sm:px-0 sm:pb-0 sm:bg-transparent sm:border-none',
          )}
        >
          <FilterMenuItem
            menuDataItem={getFilterStartingValue(filterMenuVariant)}
            menuDataCurrent={menuDataCurrent}
            onFilterChange={handleFilterChange}
          />
          {menuData.items.map(({ id, value }) => (
            <FilterMenuItem
              key={id}
              menuDataItem={value}
              menuDataCurrent={menuDataCurrent}
              onFilterChange={handleFilterChange}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
