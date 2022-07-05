import clsx from 'clsx';
import Link from 'next/link';

import { TLinkProps, LinkTargetType } from '../types';

export const FooterLink = ({ linkUrl, linkText, className }: TLinkProps) => {
  switch (linkUrl?.linktype) {
    case LinkTargetType.Story:
      return (
        <Link href={`/${linkUrl.cached_url}`}>
          <a className={clsx(className)}>{linkText}</a>
        </Link>
      );
    case LinkTargetType.Url:
      return (
        <a
          className={clsx(className)}
          href={linkUrl.url}
          target="_blank"
          rel="noreferrer"
        >
          {linkText}
        </a>
      );
    default:
      return (
        <Link href="/">
          <a className={clsx(className)}>{linkText}</a>
        </Link>
      );
  }
};
