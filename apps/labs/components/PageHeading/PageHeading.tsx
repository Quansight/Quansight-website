import { FC } from 'react';

import { TPageHeadingProps } from './types';

export const PageHeading: FC<TPageHeadingProps> = ({ title, description }) => (
  <section className="px-[3.5rem] pt-[6rem] pb-[3.2rem] mx-auto sm:pt-[8rem] sm:pb-[10rem] sm:text-center xl:pt-[5.5rem] xl:pb-[9rem] max-w-layout">
    <h1 className="text-[4rem] font-extrabold leading-[4.9rem] sm:mb-[2rem] sm:text-[4.8rem] text-violet font-heading">
      {title}
    </h1>
    <p className="text-[1.6rem] font-normal leading-[2.7rem]">{description}</p>
  </section>
);
