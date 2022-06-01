import { FC } from 'react';

import clsx from 'clsx';

import { Picture } from '@quansight/shared/ui-components';

import { LibraryLink } from '../LibraryLink/LibraryLink';
import { TTileProps } from './types';
import { TileVariant } from './types';

export const Tile: FC<TTileProps> = ({
  imageSrc,
  imageAlt,
  postType,
  title,
  author,
  date,
  link,
  tileVariant,
}) => (
  <li
    className={clsx(
      tileVariant === TileVariant.Blog && 'w-full border border-gray-400',
    )}
  >
    <LibraryLink link={link}>
      <div
        className={clsx(
          tileVariant === TileVariant.Blog && 'h-[19.8rem] sm:h-[21.9rem]',
          'relative w-full h-[21.2rem] sm:h-[23rem] lg:h-[16.4rem]',
        )}
      >
        <Picture
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          priority
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div
        className={clsx(
          tileVariant === TileVariant.Blog &&
            'px-[1.4rem] pt-[0.5rem] pb-[4.4rem] sm:px-[4rem] sm:pt-[1.5rem] sm:pb-[3.3rem]',
          'w-full',
        )}
      >
        {tileVariant === TileVariant.Library && (
          <p className="pt-8 pb-5 text-[1.4rem] font-normal leading-[3rem] uppercase sm:pb-1 xl:pb-5">
            {postType}
          </p>
        )}
        <h3
          className={clsx(
            tileVariant === TileVariant.Blog && 'leading-[3.7rem]',
            'w-1/2 text-[2.2rem] font-extrabold leading-[2.9rem] text-black lg:w-full font-heading',
          )}
        >
          {title}
        </h3>
        <div
          className={clsx(
            tileVariant === TileVariant.Blog && 'mt-[0.5rem] ml-[0.4rem]',
            'flex gap-5 justify-start items-center text-[1.2rem] font-normal leading-[2.7rem] text-black',
          )}
        >
          <p>By {author}</p>
          <p>{date}</p>
        </div>
      </div>
    </LibraryLink>
  </li>
);
