import { FC } from 'react';

import clsx from 'clsx';

import { TFilterMenuItemProps } from '../types';

export const FilterMenuItem: FC<TFilterMenuItemProps> = ({
  menuDataCurrent,
  handleClick,
  menuDataItem,
}) => {
  return (
    <li>
      <button
        className={clsx(
          'w-full text-[1.4rem] font-normal leading-[3rem] text-left uppercase',
          menuDataCurrent === menuDataItem ? 'text-pink' : 'text:black',
        )}
        onClick={() => handleClick(menuDataItem)}
      >
        {menuDataItem}
      </button>
    </li>
  );
};
