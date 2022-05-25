import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { LibraryLink } from '../LibraryLink/LibraryLink';
import { TTileProps } from './types';

export const Tile: FC<TTileProps> = ({
  imageSrc,
  imageAlt,
  postType,
  title,
  author,
  date,
  link,
}) => (
  <li>
    <LibraryLink link={link}>
      <div className="relative w-full h-[21.2rem] sm:h-[23rem] lg:h-[16.4rem]">
        <Picture
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          priority
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className="w-full">
        <p className="pt-8 pb-5 text-[1.4rem] font-normal leading-[3rem] uppercase sm:pb-1 xl:pb-5">
          {postType}
        </p>
        <h3 className="w-1/2 text-[2.2rem] font-extrabold leading-[2.9rem] text-black lg:w-full font-heading">
          {title}
        </h3>
        <div className="flex gap-5 justify-start items-center text-[1.2rem] font-normal leading-[2.7rem] text-black">
          <p>By {author}</p>
          <p>{date}</p>
        </div>
      </div>
    </LibraryLink>
  </li>
);
