import { FC } from 'react';

import { FooterLink } from './FooterLink/FooterLink';
import { TFooterCopyrightProps } from './types';

export const FooterCopyright: FC<TFooterCopyrightProps> = ({
  policyAndConditions,
  copyright,
}) => (
  <section className="mt-[3.7rem] items-center border-t-[0.5px] border-black pt-8 sm:mt-[8.5rem] sm:flex sm:gap-[2.7rem] xl:border-white">
    {policyAndConditions?.length > 0 && (
      <ul className="flex items-center justify-start gap-[2.4rem] sm:gap-[2.7rem]">
        {policyAndConditions.map((link) => (
          <li key={link._uid}>
            <FooterLink {...link} className="text-[1.2rem] leading-[2.4rem]" />
          </li>
        ))}
      </ul>
    )}
    <p className="mt-2 text-[1.2rem] leading-[2.4rem] sm:mt-0">{copyright}</p>
  </section>
);
