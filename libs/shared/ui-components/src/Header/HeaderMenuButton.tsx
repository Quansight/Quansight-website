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
      className="w-[3rem] h-[3rem] cursor-pointer"
    >
      <p className="sr-only">Menu</p>
      <ul
        aria-hidden="true"
        className="flex overflow-hidden relative flex-col gap-[0.6rem] justify-center items-center w-full h-full"
      >
        {[...Array(3).keys()].map((item) => (
          <span
            key={item}
            className={clsx(
              'block first:absolute last:absolute w-[3rem] h-[0.3rem] bg-white transition-all motion-reduce:transition-none duration-500 ease-in-out first:translate-y-[-0.9rem] last:translate-y-[0.9rem]',
              toggleNavigation &&
                'even:opacity-0 first:rotate-45 last:-rotate-45 even:translate-x-[-2rem] first:translate-y-0 last:translate-y-0',
            )}
          />
        ))}
      </ul>
    </button>
  );
};

export default HeaderMenuButton;
