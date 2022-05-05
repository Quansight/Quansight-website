import { FC } from 'react';

import Link from 'next/link';

import { TFooterNavigationProps } from '../types';

export const FooterNavigation: FC<TFooterNavigationProps> = ({
  title,
  links,
}) => (
  <div className="mb-8">
    <h2 className="pb-[1.3rem] mb-4 text-[1.6rem] font-bold leading-[3rem] border-b-[0.5px] border-black xl:border-white">
      {title}
    </h2>
    <nav className="flex flex-col">
      {links.map(({ linkText, linkUrl, _uid }) => (
        <Link href={`/${linkUrl.cached_url}`} key={_uid}>
          <a className="text-[1.4rem] font-normal leading-[3.3rem]">
            {linkText}
          </a>
        </Link>
      ))}
    </nav>
  </div>
);

export default FooterNavigation;
