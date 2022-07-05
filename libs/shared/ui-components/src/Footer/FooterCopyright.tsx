import { FC } from 'react';

import Link from 'next/link';

import { TFooterCopyrightProps } from './types';

export const FooterCopyright: FC<TFooterCopyrightProps> = ({
  policyAndConditions,
  copyright,
}) => (
  <section className="items-center pt-8 mt-[3.7rem] border-t-[0.5px] border-black sm:flex sm:gap-[2.7rem] sm:mt-[8.5rem] xl:border-white">
    <div className="flex gap-[2.4rem] justify-start items-center sm:gap-[2.7rem]">
      {policyAndConditions.map(({ linkText, linkUrl, _uid }) => (
        <Link href={`/${linkUrl.cached_url}`} key={_uid}>
          <a className="text-[1.2rem] leading-[2.4rem]">{linkText}</a>
        </Link>
      ))}
    </div>
    <p className="mt-2 text-[1.2rem] leading-[2.4rem] sm:mt-0">{copyright}</p>
  </section>
);
