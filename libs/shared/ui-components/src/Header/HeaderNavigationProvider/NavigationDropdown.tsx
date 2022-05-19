import { FC, useState } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import { TNavigationDropdown } from '../types';

export const NavigationDropdown: FC<TNavigationDropdown> = ({
  buttonText,
  links,
}) => {
  const [isNavbarItemOpen, setIsNavbarItemOpen] = useState(false);
  return (
    <li>
      <button onClick={() => setIsNavbarItemOpen(!isNavbarItemOpen)}>
        {buttonText}
        <span className="inline-block ml-4 w-0 h-0 border-x-[0.7rem] border-t-[.7rem] border-x-transparent border-y-solid border-l-solid" />
      </button>
      <ul className={clsx(isNavbarItemOpen ? 'block' : 'hidden')}>
        {links.map((link) => (
          <li key={link._uid}>
            <Link href={`/${link.linkUrl.cached_url}`}>
              <a>{link.linkText}</a>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};
