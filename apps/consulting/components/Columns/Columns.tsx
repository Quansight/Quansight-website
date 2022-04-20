import { FC } from 'react';
import clsx from 'clsx';

import { Column } from './Column/Column';

import { ColumnsVariant, TColumnsProps } from './types';

export const Columns: FC<TColumnsProps> = ({ variant, columns }) => (
  <section
    className={clsx(
      'px-[3.5rem] my-[2.4rem] mx-auto max-w-layout',
      'md:flex md:gap-[2rem]',
      'lg:px-[13rem]',
      variant === ColumnsVariant.Columns && 'lg:gap-[7.5rem]',
      variant === ColumnsVariant.Tiles && 'lg:gap-[3.4rem]',
    )}
  >
    {columns.map((props) => (
      <Column {...props} key={props._uid} variant={variant} />
    ))}
  </section>
);
