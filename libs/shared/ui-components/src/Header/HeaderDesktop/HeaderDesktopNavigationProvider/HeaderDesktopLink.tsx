import { FC } from 'react';

import Link from 'next/link';

import { getLinkUrl } from '../../utils/getLinkUrl';
import { THeaderDesktopLinkProps } from '../types';

export const HeaderDesktopLink: FC<THeaderDesktopLinkProps> = ({
  linkText,
  linkUrl,
  queryParams,
}) => (
  (<Link
    href={getLinkUrl(queryParams, linkUrl)}
    className="text-[1.7rem] font-extrabold leading-[2.825rem] capitalize transition-colors motion-reduce:transition-none ease-in-out font-heading hover:text-green">

    {linkText}

  </Link>)
);
