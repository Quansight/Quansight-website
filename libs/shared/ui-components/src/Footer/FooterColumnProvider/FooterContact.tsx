import { FC } from 'react';

import Link from 'next/link';

import { createMarkup } from '@quansight/shared/utils';

import { TFooterContactProps } from '../types';

export const FooterContact: FC<TFooterContactProps> = ({
  title,
  contact,
  buttonText,
  buttonLink,
}) => (
  <div className="flex flex-col col-span-2 sm:col-span-1">
    <h2 className="order-2 mb-4 text-[1.6rem] font-bold leading-[3rem] border-black sm:order-1 sm:pb-[1.3rem] sm:border-b-[0.5px] xl:border-white">
      {title}
    </h2>
    <div
      className="order-3 text-[1.4rem] leading-[3.3rem] sm:order-2"
      dangerouslySetInnerHTML={createMarkup(contact)}
    />
    <Link href={`/${buttonLink.cached_url}`}>
      <a className="flex order-1 justify-center items-center py-4 px-12 mb-12 w-full text-[1.6rem] font-bold leading-[3.7rem] border-2 border-black sm:order-3 sm:mt-12 sm:mb-0 xl:border-white">
        {buttonText}
        <span className="inline-block ml-4 w-0 h-0 border-y-8 border-l-8 border-black border-y-transparent xl:border-white xl:border-y-black border-y-solid border-l-solid" />
      </a>
    </Link>
  </div>
);

export default FooterContact;
