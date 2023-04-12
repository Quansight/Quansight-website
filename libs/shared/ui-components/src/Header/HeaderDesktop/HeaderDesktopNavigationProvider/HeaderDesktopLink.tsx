import { FC } from 'react';

import Link from 'next/link';

import { getLinkUrl } from '../../utils/getLinkUrl';
import { THeaderDesktopLinkProps } from '../types';

export const HeaderDesktopLink: FC<THeaderDesktopLinkProps> = ({
  linkText,
  linkUrl,
  queryParams,
}) => (
  <Link
    href={getLinkUrl(queryParams, linkUrl)}
    className="font-heading hover:text-green text-[1.7rem] font-extrabold capitalize leading-[2.825rem] transition-colors ease-in-out motion-reduce:transition-none"
  >
    {linkText}
  </Link>
);
