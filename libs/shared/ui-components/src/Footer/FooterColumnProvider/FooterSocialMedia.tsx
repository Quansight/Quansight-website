import { FC } from 'react';

import { FooterLink } from '../FooterLink/FooterLink';
import { TFooterSocialMediaProps } from '../types';

export const FooterSocialMedia: FC<TFooterSocialMediaProps> = ({
  title,
  links,
}) => (
  <div className="col-span-2 sm:col-span-1">
    <h2 className="hidden pb-[1.3rem] mb-8 text-[1.6rem] font-bold leading-[3rem] border-b-[0.5px] border-black sm:block xl:border-white">
      {title}
    </h2>
    <ul className="flex gap-12 lg:gap-8 xl:gap-12">
      {links.map((link) => (
        <li key={link._uid}>
          <FooterLink {...link} />
        </li>
      ))}
    </ul>
  </div>
);
