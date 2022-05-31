import { FC } from 'react';

import { THeaderDesktopDropdownProps } from '../types';

export const HeaderDesktopDropdown: FC<THeaderDesktopDropdownProps> = ({
  buttonText,
  // links,
}) => {
  return (
    <div>
      <button className="flex justify-between items-center text-[1.7rem] font-extrabold leading-[2.825rem] capitalize font-heading">
        {buttonText}
        <span
          aria-hidden="true"
          className="inline-block ml-4 w-0 h-0 border-x-[0.7rem] border-t-[.7rem] border-x-transparent transition-transform motion-reduce:transition-none duration-500 ease-in-out border-y-solid border-l-solid"
        />
      </button>
    </div>
  );
};
