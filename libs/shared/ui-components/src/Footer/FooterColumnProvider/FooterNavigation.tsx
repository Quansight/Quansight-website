import { FC } from 'react';

import { FooterLink } from '../FooterLink/FooterLink';
import { TFooterNavigationProps } from '../types';

export const FooterNavigation: FC<TFooterNavigationProps> = ({
  title,
  links,
}) => (
  <div className="mb-8">
    <h2 className="mb-4 border-b-[0.5px] border-black pb-[1.3rem] text-[1.6rem] font-bold leading-[3rem] xl:border-white">
      {title}
    </h2>
    <div className="flex flex-col">
      <ul>
        {links.map((link) => (
          <li
            key={link._uid}
            className="pb-5 text-[1.4rem] font-normal leading-[2.3rem]"
          >
            <FooterLink {...link} />
          </li>
        ))}
      </ul>
    </div>
  </div>
);
