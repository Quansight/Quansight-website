import Link from 'next/link';

import { TLinkProps, LinkTargetType } from '../types';

export const FooterLink = ({ linkUrl, linkText }: TLinkProps) => {
  switch (linkUrl?.linktype) {
    case LinkTargetType.Story:
      return (
        <Link href={`/${linkUrl.cached_url}`}>
          <a>{linkText}</a>
        </Link>
      );
    case LinkTargetType.Url:
      return (
        <a href={linkUrl.url} target="_blank" rel="noreferrer">
          {linkText}
        </a>
      );
    default:
      return (
        <Link href="/">
          <a>{linkText}</a>
        </Link>
      );
  }
};
