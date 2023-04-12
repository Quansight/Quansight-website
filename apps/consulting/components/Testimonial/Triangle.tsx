import { FC } from 'react';

export const Triangle: FC = () => (
  <span
    className="
      md:border-b-none
      hidden border-r-[6rem] md:absolute md:-top-1 md:left-1/2 md:block md:h-0
      md:w-0 md:-translate-x-1/2 md:border-t-[5rem] md:border-l-[6rem]
      md:border-transparent md:border-t-white
    "
  />
);
