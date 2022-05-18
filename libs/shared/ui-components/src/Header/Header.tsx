import { FC } from 'react';

import Link from 'next/link';

import { THeaderProps } from './types';

export const Header: FC<THeaderProps> = () => {
  return (
    <header>
      <Link href="#main">
        <a>Skip links</a>
      </Link>
      <div>LOGO</div>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/careers">
          <a>careers</a>
        </Link>
        <Link href="/open-source">
          <a>Open source</a>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
