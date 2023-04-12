import { FC } from 'react';

import clsx from 'clsx';

import { TFilterMenuItemProps } from '../types';

export const FilterMenuItem: FC<TFilterMenuItemProps> = ({
  menuDataCurrent,
  onFilterChange,
  menuDataItemName,
  menuDataItemValue,
}) => (
  <li>
    <button
      className={clsx(
        'w-full text-left text-[1.4rem] font-normal uppercase leading-[3rem]',
        menuDataCurrent === menuDataItemValue ? 'text-pink' : 'text:black',
      )}
      onClick={() => onFilterChange(menuDataItemValue)}
    >
      {menuDataItemName}
    </button>
  </li>
);
