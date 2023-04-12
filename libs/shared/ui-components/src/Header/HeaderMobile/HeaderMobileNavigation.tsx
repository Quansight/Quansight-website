import { FC } from 'react';

import clsx from 'clsx';

import { HeaderMobileBookingLink } from './HeaderMobileBookingLink';
import { HeaderMobileNavigationProvider } from './HeaderMobileNavigationProvider/HeaderMobileNavigationProvider';
import { THeaderMobileNavigationProps } from './types';

export const HeaderMobileNavigation: FC<THeaderMobileNavigationProps> = ({
  navigation,
  bookACallLinkText,
  isNavigationOpen,
  setIsNavigationOpen,
  domainVariant,
}) => (
  <nav
    className={clsx(
      'absolute inset-0 z-30 h-screen w-screen bg-black pt-[8rem] transition-transform duration-300 ease-in-out motion-reduce:transition-none',
      isNavigationOpen ? 'block' : 'hidden',
    )}
  >
    <div className="h-full overflow-y-auto pb-[5rem]">
      <ul
        id="menu"
        className="flex flex-col items-center justify-start px-[2rem] pt-[1.8rem]"
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
      {bookACallLinkText && (
        <HeaderMobileBookingLink
          bookACallLinkText={bookACallLinkText}
          domainVariant={domainVariant}
          setIsNavigationOpen={setIsNavigationOpen}
        />
      )}
    </div>
  </nav>
);
