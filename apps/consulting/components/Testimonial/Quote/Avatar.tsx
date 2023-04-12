import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { TAvatarProps } from '../types';

export const Avatar: FC<TAvatarProps> = ({ imageSrc, imageAlt }) => (
  <div
    className="
      relative top-[-4rem] h-[8.5rem] w-[8.5rem]
      md:left-[-6rem] md:top-0 md:h-[15rem] md:w-[15rem]
      lg:h-[27rem] lg:w-[27rem]
      xl:left-[-8rem]
    "
  >
    <Picture
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      layout="fill"
      objectFit="cover"
    />
    <span
      className="
        md:z-2
        md:bg-violet hidden md:absolute md:left-0 md:top-0 md:block md:h-full
        md:w-full md:opacity-50
      "
    />
  </div>
);
