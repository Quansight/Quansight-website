import { FC } from 'react';

import { Picture } from '../Picture/Picture';

import { TFormImageProps } from './types';

export const FormImage: FC<TFormImageProps> = ({ imageSrc, imageAlt }) => (
  <div
    className="
      flex basis-1/2 justify-center self-center mb-[8rem]
      md:self-start md:pl-[4rem] md:mb-0
      lg:pl-0
    "
  >
    <Picture imageSrc={imageSrc} imageAlt={imageAlt} width={377} height={337} />
  </div>
);
