import { FC } from 'react';

import Link from 'next/link';

import { THeaderDesktopLinkProps } from '../types';

export const HeaderDesktopLink: FC<THeaderDesktopLinkProps> = ({
  linkText,
  linkUrl,
  queryParams,
}) => {
  const url = queryParams
    ? `/${linkUrl.cached_url}${queryParams}`
    : `/${linkUrl.cached_url}`;

  return (
    <Link href={url}>
      <a className="text-[1.7rem] font-extrabold leading-[2.825rem] capitalize font-heading">
        {linkText}
      </a>
    </Link>
  );
};
