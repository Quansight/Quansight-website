import { FC } from 'react';

import clsx from 'clsx';

import { THeaderMenuButtonProps } from './types';

const HeaderMenuButton: FC<THeaderMenuButtonProps> = ({
  toggleNavigation,
  setToggleNavigation,
}) => {
  return (
    <button
      aria-expanded={toggleNavigation ? 'true' : 'false'}
      aria-controls="options"
      onClick={() => setToggleNavigation(!toggleNavigation)}
      className=" w-[3rem] h-[3rem]"
    >
      <p className="sr-only">Menu</p>
      <ul
        aria-hidden="true"
        className="flex relative flex-col gap-[0.6rem] justify-center items-center w-full h-full"
      >
        {[...Array(3).keys()].map((item) => (
          <span
            key={item}
            className={clsx(
              'block w-[3rem] h-[0.3rem] bg-white',
              toggleNavigation &&
                'even:hidden absolute top-1/2 -left-1/2 first:rotate-45 last:-rotate-45 translate-x-1/2 -translate-y-1/2',
            )}
          />
        ))}
      </ul>
    </button>
  );
};

export default HeaderMenuButton;
