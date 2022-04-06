import { FC } from 'react';

import { Picture } from '@quansight/shared/ui-components';

import { TFeatureProps } from './types';

const Feature: FC<TFeatureProps> = ({ title, text, imageSrc, imageAlt }) => (
  <li
    className="
      pt-[2rem] pb-[5rem] text-center last:border-0 border-b
      border-white
      lg:px-[5rem] lg:pb-[13rem] lg:w-1/3 lg:border-r lg:border-b-0
      xl:px-[11rem]
    "
  >
    <div className="">
      <Picture imageSrc={imageSrc} imageAlt={imageAlt} width={90} height={90} />
    </div>
    <h3
      className="
        my-[1.5rem] text-[2.2rem] font-extrabold leading-[3rem] text-white uppercase lg:mt-[4rem]
        lg:mb-[2rem] font-heading
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
