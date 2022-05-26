import { FC } from 'react';

import clsx from 'clsx';

import { TFilterMenuItemProps } from '../types';

export const FilterMenuItem: FC<TFilterMenuItemProps> = ({
  menuDataCurrent,
  setIsDropdownOpen,
  handleFilter,
  menuDataItem,
}) => {
  const handleClick = (): void => {
    setIsDropdownOpen(false);
    handleFilter(menuDataItem);
  };

  return (
    <li>
      <button
        className={clsx(
          'w-full text-[1.4rem] font-normal leading-[3rem] text-left uppercase',
          menuDataCurrent === menuDataItem ? 'text-pink' : 'text:black',
        )}
        onClick={handleClick}
      >
        {menuDataItem}
      </button>
    </li>
  );
};
