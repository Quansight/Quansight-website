import { FC } from 'react';

import TriptychColumn from './TriptychColumn';

import { TTriptychProps } from './types';

export const Triptych: FC<TTriptychProps> = ({ title, columns }) => {
  return (
    <section className="max-w-layout">
      <h2 className="">{title}</h2>
      {columns.map((props) => (
        <TriptychColumn {...props} key={props._uid} />
      ))}
    </section>
  );
};
