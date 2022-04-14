import { FC } from 'react';
import { TFooterNavigationProps } from '../types';
import Link from 'next/link';

export const FooterNavigation: FC<TFooterNavigationProps> = ({
  title,
  links,
}) => (
  <div>
    <h2>{title}</h2>
    <nav>
      {links.map(({ linkText, linkUrl, _uid }) => (
        <Link href={`/${linkUrl.cached_url}`} key={_uid}>
          <a>{linkText}</a>
        </Link>
      ))}
    </nav>
  </div>
);

export default FooterNavigation;
