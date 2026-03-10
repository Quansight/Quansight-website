import { FC, useMemo } from 'react';

import { Tile } from './Tile';
import { TTilesProps } from './types';
import { areValidSectionTiles } from './utils/areValidSectionTiles';
import { divideLibraryTiles } from '../../utils/divideLibraryTiles/divideLibraryTiles';
import { Newsletter } from '../Newsletter/Newsletter';

export const Tiles: FC<TTilesProps> = ({ tiles, tileVariant }) => {
  const slicedTiles = useMemo(() => divideLibraryTiles(tiles), [tiles]);

  return (
    <section>
      {tiles.length === 0 && (
        <p className="text-center text-[2.2rem] font-extrabold text-black">
          We don&apos;t have any posts yet. Please check back later.
        </p>
      )}
      {areValidSectionTiles(slicedTiles?.sectionTop) && (
        <ul className="grid grid-cols-1 gap-[4.2rem] sm:grid-cols-2 sm:gap-x-[2.4rem] sm:gap-y-[3.6rem] lg:grid-cols-3">
          {slicedTiles.sectionTop.map((tile) => (
            <Tile {...tile} key={tile.key} tileVariant={tileVariant} />
          ))}
        </ul>
      )}
      <Newsletter />
      {areValidSectionTiles(slicedTiles?.sectionBottom) && (
        <ul className="grid grid-cols-1 gap-[4.2rem] sm:grid-cols-2 sm:gap-x-[2.4rem] sm:gap-y-[3.6rem] lg:grid-cols-3">
          {slicedTiles.sectionBottom.map((tile) => (
            <Tile {...tile} key={tile.key} tileVariant={tileVariant} />
          ))}
        </ul>
      )}
    </section>
  );
};
