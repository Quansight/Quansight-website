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
          'relative h-[21.2rem] w-full sm:h-[23rem] lg:h-[16.4rem]',
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
          'w-full',
          tileVariant === TileVariant.Blog &&
            'px-[1.4rem] pt-[0.5rem] pb-[4.4rem] sm:px-[4rem] sm:pt-[1.5rem] sm:pb-[3.3rem]',
        )}
      >
        {tileVariant === TileVariant.Library && (
          <p className="pt-8 pb-5 text-[1.4rem] font-normal uppercase leading-[3rem] sm:pb-1 xl:pb-5">
            {postType}
          </p>
        )}
        <h3
          className={clsx(
            'font-heading w-1/2 text-[2.2rem] font-extrabold leading-[2.9rem] text-black lg:w-full',
            tileVariant === TileVariant.Blog && 'leading-[3.7rem]',
          )}
        >
          {title}
        </h3>
        <div
          className={clsx(
            'flex items-center justify-start gap-5 text-[1.2rem] font-normal leading-[2.7rem] text-black',
            tileVariant === TileVariant.Blog && 'mt-[0.5rem] ml-[0.4rem]',
          )}
        >
          <p>By {author}</p>
          <p>{date}</p>
        </div>
      </div>
    </LibraryLink>
  </li>
);
