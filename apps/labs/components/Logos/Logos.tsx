import { FC } from 'react';

import Link from 'next/link';

import { LogosGrid } from './LogosGrid';
import { TLogosProps } from './types';

export const Logos: FC<TLogosProps> = ({ title, grid, linkTitle, linkUrl }) => {
  const isLink = linkTitle && linkUrl;

  return (
    <section className="flex flex-col items-center py-[7rem] px-[3rem] mx-auto text-center max-w-layout">
      {title && (
        <h2 className="pb-[3.8rem] mx-auto max-w-[65rem] text-[2.7rem] font-extrabold leading-[3.5rem]">
          {title}
        </h2>
      )}
      <LogosGrid grid={grid} />
      {isLink && (
        <Link href={linkUrl}>
          <a className="mt-[3rem] text-[1.6rem] font-bold leading-[2.1rem] underline text-violet">
            {linkTitle}
          </a>
        </Link>
      )}
    </section>
  );
};
