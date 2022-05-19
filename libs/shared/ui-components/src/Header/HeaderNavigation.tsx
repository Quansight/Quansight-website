import { FC } from 'react';

import { BookACallLink } from './BookACallLink';
import { HeaderNavigationProvider } from './HeaderNavigationProvider/HeaderNavigationProvider';
import { THeaderNavigationProps } from './types';

export const HeaderNavigation: FC<THeaderNavigationProps> = ({
  navigation,
  bookACallLinkText,
}) => {
  return (
    <nav className="">
      <div className="">
        {navigation.map((navigationItem) => (
          <HeaderNavigationProvider
            navigationItem={navigationItem}
            key={navigationItem._uid}
          />
        ))}
      </div>
      <BookACallLink bookACallLinkText={bookACallLinkText} />
    </nav>
  );
};
