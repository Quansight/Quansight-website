import { FC } from 'react';

export const Triangle: FC = () => (
  <span
    className="
      hidden
      border-r-[6rem] md:block md:absolute md:-top-1 md:left-1/2 md:w-0 md:h-0
      md:border-t-[5rem] md:border-l-[6rem] md:border-transparent md:border-t-white
      md:-translate-x-1/2 md:border-b-none
    "
  />
);
