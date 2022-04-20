import { FC } from 'react';

import { Avatar } from './Avatar';

import { TQuoteProps } from '../types';

export const Quote: FC<TQuoteProps> = ({
  imageSrc,
  imageAlt,
  testimonial,
  person,
  position,
}) => (
  <div className="relative mx-auto w-full max-w-[93rem] z-1 bg-lightgray">
    <div className="relative pb-[5rem] md:flex md:pt-[7rem] md:pb-[6.4rem]">
      <Avatar imageSrc={imageSrc} imageAlt={imageAlt} />
      <div className="px-[2rem] text-black md:px-0">
        <p className="text-[2rem] leading-[2.7rem]">{testimonial}</p>
        <p className="pt-[2rem] text-[2.2rem] leading-[3.5rem]">{person}</p>
        <p className="text-[1.5rem] leading-[2.7rem]">{position}</p>
      </div>
    </div>
  </div>
);
