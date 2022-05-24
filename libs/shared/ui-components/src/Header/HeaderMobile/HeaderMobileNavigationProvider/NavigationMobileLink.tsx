import { FC } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import { LinkVariant } from '../../Common/types';
import { TNavigationMobileLink } from '../types';

export const NavigationMobileLink: FC<TNavigationMobileLink> = ({
  linkText,
  linkUrl,
  variant = LinkVariant.Navigation,
  setIsNavigationOpen,
}) => (
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/anchor-is-valid */

  <Link
    href={linkUrl.cached_url === 'homepage' ? '/' : `/${linkUrl.cached_url}`}
  >
    <a
      onClick={() => setIsNavigationOpen(false)}
      className={clsx(
        'inline-block px-[2rem] w-full text-[1.7rem] leading-[2.825rem] text-left capitalize font-heading',
        variant === LinkVariant.Dropdown
          ? 'font-normal'
          : 'py-[1.6rem] font-extrabold',
      )}
    >
      {linkText}
    </a>
  </Link>
);
