import { FC } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import { TNavigationLink, LinkVariant } from '../types';

export const NavigationLink: FC<TNavigationLink> = ({
  linkText,
  linkUrl,
  variant = LinkVariant.Navigation,
}) => (
  <Link href={`/${linkUrl.cached_url}`}>
    <a
      className={clsx(
        'inline-block  px-[2rem] w-full text-[1.7rem]  leading-[2.825rem] text-left capitalize font-heading',
        variant === LinkVariant.Dropdown
          ? 'font-normal'
          : 'py-[1.6rem] font-extrabold',
      )}
    >
      {linkText}
    </a>
  </Link>
);
