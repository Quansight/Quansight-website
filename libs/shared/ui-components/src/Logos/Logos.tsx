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
        flex flex-col items-center py-[4rem] px-[3rem] mx-auto text-center 
        md:py-[6.5rem] md:px-[13rem]
        max-w-layout
      "
    >
      {title && (
        <h2
          className={clsx(
            'relative mx-auto max-w-[65rem] leading-[3.5rem] z-1 font-heading',
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
        (<Link
          href={linkUrl}
          className={clsx(
            'mt-[3rem] text-[1.6rem] font-bold leading-[2.1rem] underline',
            colorVariant === LogosColors.White && 'text-white',
            colorVariant === LogosColors.Black && 'text-violet',
          )}>

          {linkTitle}

        </Link>)
      )}
    </section>
  );
};
