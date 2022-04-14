import { FC } from 'react';

import Column from './Column';

import { TColumnsProps } from './types';

export const Columns: FC<TColumnsProps> = ({ columns }) => (
  <section
    className="
      px-[3.5rem] my-[2.4rem] mx-auto
      md:flex md:gap-[2rem] 
      lg:gap-[7.5rem] lg:px-[13rem]
      max-w-layout
    "
  >
    {columns.map((props) => (
      <Column {...props} key={props._uid} />
    ))}
  </section>
);
