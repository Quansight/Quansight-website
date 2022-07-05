import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { TAvatarProps } from '../types';

export const Avatar: FC<TAvatarProps> = ({ imageSrc, imageAlt }) => (
  <div
    className="
      relative top-[-4rem] w-[8.5rem] h-[8.5rem]
      md:top-0 md:left-[-6rem] md:w-[15rem] md:h-[15rem]
      lg:w-[27rem] lg:h-[27rem]
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
        hidden
        md:block md:absolute md:top-0 md:left-0 md:w-full md:h-full md:opacity-50
        md:z-2 md:bg-violet
      "
    />
  </div>
);
