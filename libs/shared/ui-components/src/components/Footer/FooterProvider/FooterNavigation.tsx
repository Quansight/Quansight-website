import { FC } from 'react';
import { TFooterNavigationProps } from '../types';
import Link from 'next/link';

export const FooterNavigation: FC<TFooterNavigationProps> = ({
  title,
  links,
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <nav>
        <Link href="/">
          <a>link</a>
        </Link>
      </nav>
    </div>
  );
};

export default FooterNavigation;
