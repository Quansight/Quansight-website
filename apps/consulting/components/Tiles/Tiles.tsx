import { FC } from 'react';

import { Tile } from './Tile';
import { TTilesProps } from './types';

export const Tiles: FC<TTilesProps> = ({ tiles }) => {
  return (
    <ul>
      {tiles.map((tile) => (
        <Tile tile={tile} key={tile.uuid} />
      ))}
    </ul>
  );
};
