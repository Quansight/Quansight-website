import { FC } from 'react';

import clsx from 'clsx';

import { TFilterMenuItemProps } from '../types';

export const FilterMenuItem: FC<TFilterMenuItemProps> = ({
  menuDataCurrent,
  onFilterChange,
  menuDataItem,
}) => {
  return (
    <li>
      <button
        className={clsx(
          'w-full text-[1.4rem] font-normal leading-[3rem] text-left uppercase',
          menuDataCurrent === menuDataItem ? 'text-pink' : 'text:black',
        )}
        onClick={() => onFilterChange(menuDataItem)}
      >
        {menuDataItem}
      </button>
    </li>
  );
};
