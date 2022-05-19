import { FC } from 'react';

import clsx from 'clsx';

import { BookACallLink } from './Buttons/BookACallLink';
import { HeaderNavigationProvider } from './HeaderNavigationProvider/HeaderNavigationProvider';
import { THeaderNavigationProps } from './types';

export const HeaderNavigation: FC<THeaderNavigationProps> = ({
  navigation,
  bookACallLinkText,
  isNavigationOpen,
}) => {
  return (
    <nav className={clsx(isNavigationOpen ? 'block' : 'hidden')}>
      <ul className="">
        {navigation.map((navigationItem) => (
          <HeaderNavigationProvider
            navigationItem={navigationItem}
            key={navigationItem._uid}
          />
        ))}
      </ul>
      <BookACallLink bookACallLinkText={bookACallLinkText} />
    </nav>
  );
};
