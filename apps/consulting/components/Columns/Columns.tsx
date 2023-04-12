import { FC } from 'react';

import clsx from 'clsx';

import { Column } from './Column/Column';
import { ColumnsVariant, TColumnsProps } from './types';

export const Columns: FC<TColumnsProps> = ({ variant, columns }) => (
  <section
    className={clsx(
      'max-w-layout mx-auto my-[2.4rem] px-[3.5rem]',
      'md:grid md:grid-flow-col md:grid-rows-[repeat(3,_min-content)] md:gap-x-[2rem]',
      'lg:px-[13rem]',
      variant === ColumnsVariant.Columns && 'lg:gap-x-[7.5rem]',
      variant === ColumnsVariant.Tiles && 'lg:flex lg:gap-x-[3.4rem]',
    )}
  >
    {columns.map((props) => (
      <Column {...props} key={props._uid} variant={variant} />
    ))}
  </section>
);
