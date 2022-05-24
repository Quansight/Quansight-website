import { FC } from 'react';

import clsx from 'clsx';

import { HeaderMobileBookingLink } from './HeaderMobileBookingLink';
import { HeaderMobileNavigationProvider } from './HeaderMobileNavigationProvider/HeaderNavigationProvider';
import { THeaderMobileNavigationProps } from './types';

export const HeaderMobileNavigation: FC<THeaderMobileNavigationProps> = ({
  navigation,
  bookACallLinkText,
  isNavigationOpen,
  setIsNavigationOpen,
}) => (
  <nav
    className={clsx(
      'absolute inset-0 z-30 pt-[8rem] w-screen h-screen bg-black transition-transform motion-reduce:transition-none duration-300 ease-in-out',
      isNavigationOpen ? 'block' : 'hidden',
    )}
  >
    <div className="overflow-y-auto pb-[5rem] h-full">
      <ul
        id="menu"
        className="flex flex-col justify-start items-center px-[2rem] pt-[1.8rem]"
      >
        {navigation.map((navigationItem) => (
          <li
            className="w-full border-b border-b-white"
            key={navigationItem._uid}
          >
            <HeaderMobileNavigationProvider
              navigationItem={navigationItem}
              isNavigationOpen={isNavigationOpen}
              setIsNavigationOpen={setIsNavigationOpen}
            />
          </li>
        ))}
      </ul>
      <HeaderMobileBookingLink bookACallLinkText={bookACallLinkText} />
    </div>
  </nav>
);
