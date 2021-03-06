import { FC } from 'react';

import clsx from 'clsx';

import { Picture } from '../Picture/Picture';
import { TLogosGridProps } from './types';

export const LogosGrid: FC<TLogosGridProps> = ({ grid }) => (
  <ul className="flex flex-wrap gap-y-[2rem] justify-center w-full md:gap-y-[3rem]">
    {grid.map(({ imageSrc, imageAlt }) => (
      <li
        key={imageAlt}
        className={clsx(
          'w-1/2 text-center',
          grid.length === 6 ? 'lg:w-2/12' : 'lg:w-1/5',
        )}
      >
        <div className="relative w-auto h-[5.3rem]">
          <Picture
            imageSrc={imageSrc}
            imageAlt={imageAlt}
            layout="fill"
            objectFit="contain"
          />
        </div>
      </li>
    ))}
  </ul>
);
