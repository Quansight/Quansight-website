import type { FC } from 'react';

import clsx from 'clsx';

import { LogosGrid } from './LogosGrid';

type LogoItem = { src: string; alt: string };
type LogosColor = 'black' | 'white';

type LogosProps = {
  colorVariant: LogosColor;
  title?: string;
  linkTitle?: string;
  linkUrl?: string;
  grid: LogoItem[];
};

export const Logos: FC<LogosProps> = ({
  colorVariant,
  title,
  grid,
  linkTitle,
  linkUrl,
}) => {
  const isLink = linkTitle && linkUrl;

  return (
    <section className="flex flex-col items-center py-[4rem] px-[3rem] mx-auto text-center md:py-[6.5rem] md:px-[13rem] max-w-layout">
      {title && (
        <h2
          className={clsx(
            'relative mx-auto max-w-[65rem] leading-[3.5rem] z-1 font-heading',
            colorVariant === 'white' &&
              'hidden pb-[2rem] text-[2.2rem] text-white md:block',
            colorVariant === 'black' &&
              'pb-[3.8rem] text-[2.7rem] font-extrabold text-black',
          )}
        >
          {title}
        </h2>
      )}
      <LogosGrid grid={grid} />
      {isLink && (
        <a
          href={linkUrl}
          className={clsx(
            'mt-[3rem] text-[1.6rem] font-bold leading-[2.1rem] underline',
            colorVariant === 'white' && 'text-white',
            colorVariant === 'black' && 'text-violet',
          )}
        >
          {linkTitle}
        </a>
      )}
    </section>
  );
};
