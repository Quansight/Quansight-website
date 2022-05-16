import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { LibraryLink } from './LibraryLink';
import { TTileProps } from './types';
import { getTileProps } from './utils/getTileProps';

export const Tile: FC<TTileProps> = ({ tile }) => {
  const { imageSrc, imageAlt, postType, title, author, date, link } =
    getTileProps(tile);

  return (
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
        <div className="w-1/2 lg:w-full">
          <p className="pt-8 pb-5 text-[1.4rem] font-normal leading-[3rem] uppercase">
            {postType}
          </p>
          <h3 className="text-[2.2rem] font-extrabold leading-[2.9rem] text-black font-heading">
            {title}
          </h3>
          <div className="flex gap-5 justify-start items-center text-[1.2rem] font-normal leading-[2.7rem] text-black">
            <p>{author}</p>
            <p>{date}</p>
          </div>
        </div>
      </LibraryLink>
    </li>
  );
};
