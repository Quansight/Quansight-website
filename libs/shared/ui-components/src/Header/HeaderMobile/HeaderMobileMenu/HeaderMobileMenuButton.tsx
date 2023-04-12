import { FC } from 'react';

import clsx from 'clsx';

import { THeaderMobileMenuButtonProps } from '../types';

export const HeaderMobileMenuButton: FC<THeaderMobileMenuButtonProps> = ({
  isNavigationOpen,
  setIsNavigationOpen,
}) => (
  <button
    aria-expanded={isNavigationOpen ? 'true' : 'false'}
    aria-controls="menu"
    onClick={() => setIsNavigationOpen(!isNavigationOpen)}
    className="h-[3rem] w-[3rem] cursor-pointer"
  >
    <p className="sr-only">Menu</p>
    <ul
      aria-hidden="true"
      className="relative flex h-full w-full flex-col items-center justify-center gap-[0.6rem] overflow-hidden"
    >
      {[...Array(3).keys()].map((item) => (
        <span
          key={item}
          className={clsx(
            'block h-[0.3rem] w-[3rem] bg-white transition-all duration-500 ease-in-out first:absolute first:translate-y-[-0.9rem] last:absolute last:translate-y-[0.9rem] motion-reduce:transition-none',
            isNavigationOpen &&
              'first:translate-y-0 first:rotate-45 last:translate-y-0 last:-rotate-45 even:translate-x-[-2rem] even:opacity-0',
          )}
        />
      ))}
    </ul>
  </button>
);
