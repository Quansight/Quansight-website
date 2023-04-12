import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { TFeatureProps } from './types';

const Feature: FC<TFeatureProps> = ({ title, text, imageSrc, imageAlt }) => (
  <li
    className="
      border-b border-white pb-[5rem] pt-[2rem] text-center
      last:border-0
      lg:w-1/3 lg:border-b-0 lg:border-r lg:px-[5rem] lg:pb-[13rem]
      xl:px-[11rem]
    "
  >
    <div className="relative h-[9rem]">
      <Picture
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        layout="fill"
        objectFit="contain"
      />
    </div>
    <h3
      className="
        font-heading my-[1.5rem] text-[2.2rem] font-extrabold uppercase leading-[3rem] text-white
        lg:mb-[2rem] lg:mt-[4rem]
      "
    >
      {title}
    </h3>
    <p className="text-[1.8rem] font-bold leading-[2.7rem] text-white">
      {text}
    </p>
  </li>
);

export default Feature;
