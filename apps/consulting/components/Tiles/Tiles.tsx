import { FC } from 'react';

import { Tile } from './Tile';
import { TTilesProps } from './types';

export const Tiles: FC<TTilesProps> = ({ tiles }) => (
  <ul className="grid grid-cols-1 gap-[4.2rem] px-8 mx-auto sm:grid-cols-2 lg:grid-cols-3 max-w-layout">
    {tiles.map((tile) => (
      <Tile tile={tile} key={tile.uuid} />
    ))}
  </ul>
);
