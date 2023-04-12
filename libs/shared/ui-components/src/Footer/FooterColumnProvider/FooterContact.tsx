import { FC } from 'react';

import Link from 'next/link';

import { createMarkup } from '@quansight/shared/utils';
import { BOOK_A_CALL_FORM_ID } from '@quansight/shared/utils';

import { TFooterContactProps } from '../types';

export const FooterContact: FC<TFooterContactProps> = ({
  title,
  contact,
  buttonText,
  buttonLink,
}) => (
  <div className="col-span-2 flex flex-col sm:col-span-1">
    <h2 className="order-2 mb-4 border-black text-[1.6rem] font-bold leading-[3rem] sm:order-1 sm:border-b-[0.5px] sm:pb-[1.3rem] xl:border-white">
      {title}
    </h2>
    <div
      className="order-3 text-[1.4rem] leading-[3.3rem] sm:order-2"
      dangerouslySetInnerHTML={createMarkup(contact)}
    />
    {buttonText && buttonLink && (
      <Link href={`/${buttonLink.cached_url}#${BOOK_A_CALL_FORM_ID}`}>
        <a className="order-1 mb-12 flex w-full items-center justify-center border-2 border-black px-12 py-4 text-[1.6rem] font-bold leading-[3.7rem] sm:order-3 sm:mb-0 sm:mt-12 xl:border-white">
          {buttonText}
          <span className="border-y-solid border-l-solid ml-4 inline-block h-0 w-0 border-y-8 border-l-8 border-black border-y-transparent xl:border-white xl:border-y-black" />
        </a>
      </Link>
    )}
  </div>
);
