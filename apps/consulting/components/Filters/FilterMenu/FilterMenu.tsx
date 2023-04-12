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

  const currentMenuName =
    menuData.find(({ value }) => value === menuDataCurrent)?.name ||
    menuDataCurrent;

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
          'relative w-full border-2 border-gray-300 bg-gray-200  px-[1.2rem] py-[0.8rem] text-center text-[1.4rem] font-normal uppercase leading-[3rem] sm:w-[26rem]',
          isDropdownOpen ? 'border-b-transparent' : 'border-b-gray-300',
          filterMenuVariant === FilterMenuVariant.Type
            ? 'sm:hidden'
            : 'sm:flex sm:items-center sm:justify-between sm:gap-0',
        )}
      >
        {currentMenuName}
        <span
          className={clsx(
            'border-x-solid border-l-solid absolute right-[1rem] top-1/2 inline-block h-0 w-0 translate-y-[-50%] border-x-8 border-t-8 border-x-transparent',
            isDropdownOpen
              ? 'border-violet -rotate-180'
              : 'rotate-0 border-gray-300',
            filterMenuVariant === FilterMenuVariant.Category &&
              'sm:translate-y-none sm:relative sm:right-0 sm:top-0',
          )}
        />
      </button>
      <div className="relative w-full">
        <ul
          id="filters"
          className={clsx(
            'absolute top-[-.2rem] z-20 w-full border-x-2 border-b-2 border-gray-300 bg-gray-200 px-[1.2rem] pb-[0.8rem]',
            isDropdownOpen
              ? 'block'
              : filterMenuVariant === FilterMenuVariant.Type
              ? 'hidden sm:relative sm:block'
              : 'hidden',
            filterMenuVariant === FilterMenuVariant.Type &&
              'sm:flex sm:items-center sm:justify-start sm:gap-[2rem] sm:border-none sm:bg-transparent sm:px-0 sm:pb-0',
          )}
        >
          <FilterMenuItem
            menuDataItemValue={getFilterStartingValue(filterMenuVariant)}
            menuDataItemName={getFilterStartingValue(filterMenuVariant)}
            menuDataCurrent={menuDataCurrent}
            onFilterChange={handleFilterChange}
          />
          {menuData.map(({ key, value, name }) => (
            <FilterMenuItem
              key={key}
              menuDataItemValue={value}
              menuDataItemName={name}
              menuDataCurrent={menuDataCurrent}
              onFilterChange={handleFilterChange}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
