import { FC } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import { LogosGrid } from './LogosGrid';
import { LogosColors, TLogosProps } from './types';

export const Logos: FC<TLogosProps> = ({
  colorVariant,
  title,
  grid,
  linkTitle,
  linkUrl,
}) => {
  const isLink = linkTitle && linkUrl;

  return (
    <section
      className="
        max-w-layout mx-auto flex flex-col items-center px-[3rem] py-[4rem] 
        text-center md:px-[13rem]
        md:py-[6.5rem]
      "
    >
      {title && (
        <h2
          className={clsx(
            'z-1 font-heading relative mx-auto max-w-[65rem] leading-[3.5rem]',
            colorVariant === LogosColors.White &&
              'hidden pb-[2rem] text-[2.2rem] text-white md:block',
            colorVariant === LogosColors.Black &&
              'pb-[3.8rem] text-[2.7rem] font-extrabold text-black',
          )}
        >
          {title}
        </h2>
      )}

      <LogosGrid grid={grid} />

      {isLink && (
        <Link href={linkUrl}>
          <a
            className={clsx(
              'mt-[3rem] text-[1.6rem] font-bold leading-[2.1rem] underline',
              colorVariant === LogosColors.White && 'text-white',
              colorVariant === LogosColors.Black && 'text-violet',
            )}
          >
            {linkTitle}
          </a>
        </Link>
      )}
    </section>
  );
};
