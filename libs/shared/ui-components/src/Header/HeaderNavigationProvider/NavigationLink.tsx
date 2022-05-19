import { FC } from 'react';

import Link from 'next/link';

import { TNavigationLink } from '../types';

export const NavigationLink: FC<TNavigationLink> = ({ linkText, linkUrl }) => {
  return (
    <li>
      <Link href={`/${linkUrl.cached_url}`}>
        <a>{linkText}</a>
      </Link>
    </li>
  );
};
