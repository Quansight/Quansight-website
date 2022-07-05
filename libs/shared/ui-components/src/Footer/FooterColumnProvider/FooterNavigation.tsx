import { FC } from 'react';

import Link from 'next/link';

import { getUrl } from '@quansight/shared/utils';

import { TFooterNavigationProps } from '../types';

export const FooterNavigation: FC<TFooterNavigationProps> = ({
  title,
  links,
}) => (
  <div className="mb-8">
    <h2 className="pb-[1.3rem] mb-4 text-[1.6rem] font-bold leading-[3rem] border-b-[0.5px] border-black xl:border-white">
      {title}
    </h2>
    <div className="flex flex-col">
      <ul>
        {links.map(({ linkText, linkUrl, _uid }) => (
          <li key={_uid}>
            <Link href={getUrl(linkUrl)}>
              <a className="pb-5 text-[1.4rem] font-normal leading-[2.3rem]">
                {linkText}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
