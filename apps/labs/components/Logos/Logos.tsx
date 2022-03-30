import { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import { Picture } from '@quansight/shared/ui-components';

import { TLogosProps } from './types';

export const Logos: FC<TLogosProps> = ({ title, grid, linkTitle, linkUrl }) => {
  return (
    <section className="flex flex-col items-center py-[7rem] px-[3rem] mx-auto max-w-layout">
      {title && (
        <h2 className="pb-[3.8rem] mx-auto max-w-[65rem] text-[2.7rem] font-extrabold leading-[3.5rem] text-center">
          {title}
        </h2>
      )}
      <ul className="flex flex-wrap justify-center">
        {grid.map(({ imageSrc, imageAlt }) => (
          <li
            key={imageAlt}
            className={clsx(
              'relative py-[1.5rem] w-1/2 text-center lg:py-[4.5rem]',
              grid.length === 6 ? 'lg:1/6' : 'lg:w-1/5',
            )}
          >
            <Picture
              imageSrc={imageSrc}
              imageAlt={imageAlt}
              width={200}
              height={64}
            />
          </li>
        ))}
      </ul>
      {linkUrl && (
        <Link href={linkUrl}>
          <a className="mt-[2rem] text-[1.6rem] font-bold leading-[2.1rem] text-center underline lg:mt-0 text-violet">
            {linkTitle}
          </a>
        </Link>
      )}
    </section>
  );
};
