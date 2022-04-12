import { FC } from 'react';

import Column from './Column';

import { TColumnsProps } from './types';

export const Columns: FC<TColumnsProps> = ({ columns }) => (
  <section>
    {/* {columns.map((props) => (
      <Column {...props} key={props._uid} />
    ))} */}
    Hello
  </section>
);
