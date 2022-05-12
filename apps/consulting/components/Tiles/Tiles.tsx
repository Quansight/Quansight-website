import { FC } from 'react';

import { Tile } from './Tile';
import { TTilesProps } from './types';

export const Tiles: FC<TTilesProps> = ({ tiles }) => (
  <ul className="grid grid-cols-1 gap-[4.2rem] sm:grid-cols-2 sm:gap-x-[2.4rem] sm:gap-y-[3.6rem] lg:grid-cols-3">
    {tiles.map((tile) => (
      <Tile tile={tile} key={tile.uuid} />
    ))}
  </ul>
);
