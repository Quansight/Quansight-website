import { FC } from 'react';

import clsx from 'clsx';

import { HeaderNavigationProvider } from './HeaderNavigationProvider/HeaderNavigationProvider';
import { HeaderBookingLink } from './Links/HeaderBookingLink';
import { THeaderNavigationProps } from './types';

export const HeaderNavigation: FC<THeaderNavigationProps> = ({
  navigation,
  bookACallLinkText,
  isNavigationOpen,
}) => {
  return (
    <nav className="absolute top-0 px-[2rem] pt-[9rem] w-screen h-screen bg-black">
      <ul className="">
        {navigation.map((navigationItem) => (
          <li className="border-b border-b-white" key={navigationItem._uid}>
            <HeaderNavigationProvider navigationItem={navigationItem} />
          </li>
        ))}
      </ul>
      <HeaderBookingLink bookACallLinkText={bookACallLinkText} />
    </nav>
  );
};
