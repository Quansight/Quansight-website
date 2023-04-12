import { FC } from 'react';

import { FooterLink } from '../FooterLink/FooterLink';
import { TFooterSocialMediaProps } from '../types';

export const FooterSocialMedia: FC<TFooterSocialMediaProps> = ({
  title,
  links,
}) => (
  <div className="col-span-2 sm:col-span-1">
    <h2 className="mb-8 hidden border-b-[0.5px] border-black pb-[1.3rem] text-[1.6rem] font-bold leading-[3rem] sm:block xl:border-white">
      {title}
    </h2>
    <ul className="flex flex-wrap gap-12 lg:gap-8 xl:gap-12">
      {links.map((link) => (
        <li key={link._uid}>
          <FooterLink {...link} />
        </li>
      ))}
    </ul>
  </div>
);
