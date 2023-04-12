import { FC } from 'react';

import { TPageHeadingProps } from './types';

export const PageHeading: FC<TPageHeadingProps> = ({ title, description }) => (
  <section className="max-w-layout mx-auto px-[3.5rem] pb-[3.2rem] pt-[6rem] sm:pb-[10rem] sm:pt-[8rem] sm:text-center xl:pb-[9rem] xl:pt-[5.5rem]">
    <h1 className="text-violet font-heading text-[4rem] font-extrabold leading-[4.9rem] sm:mb-[2rem] sm:text-[4.8rem]">
      {title}
    </h1>
    <p className="text-[1.6rem] font-normal leading-[2.7rem]">{description}</p>
  </section>
);
