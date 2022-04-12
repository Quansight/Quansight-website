import { FC, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Theme } from '@quansight/shared/types';

import { Picture } from '../Picture/Picture';

import { TLogosProps } from './types';

const getWidthClassName = (itemsLength: number): string => {
  switch (itemsLength) {
    case 5:
      return 'w-1/3';
    case 6:
      return 'w-1/6';
    default:
      return 'w-1/6';
  }
};

export const Logos: FC<TLogosProps> = ({
  title,
  grid,
  linkTitle,
  linkUrl,
  theme,
}) => {
  const isLightTheme = theme === Theme.Light;
  const isDarkTheme = theme === Theme.Dark;

  return (
    <section className="flex relative flex-col items-center py-[7rem] px-[3rem] mx-auto max-w-layout">
      {title && (
        <h2
          className={clsx(
            'pb-[3.8rem] mx-auto max-w-[65rem] text-[2.7rem] font-extrabold leading-[3.5rem] text-center',
            {
              'text-white': isLightTheme,
              'text-black': isDarkTheme,
            },
          )}
        >
          {title}
        </h2>
      )}
      <ul className="flex flex-wrap justify-center w-full">
        {grid.map(({ imageSrc, imageAlt }) => (
          <li
            key={imageAlt}
            className={clsx(
              'relative py-[1.5rem] mx-[1rem] text-center lg:py-[4.5rem]',
              getWidthClassName(grid.length),
              // 'lg:w-1/3',
              // grid.length === 6 ? 'lg:1/6' : 'lg:w-1/5',
            )}
          >
            <Picture
              imageSrc={imageSrc}
              imageAlt={imageAlt}
              naturalDimensions
              layout="fill"
              objectFit="contain"
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
