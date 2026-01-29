import { FC, useState, useEffect } from 'react';

import { divideLibraryTiles } from '../../utils/divideLibraryTiles/divideLibraryTiles';
import { Newsletter } from '../Newsletter/Newsletter';
import { Tile } from './Tile';
import { TTilesProps, TSlicedTiles } from './types';
import { areValidSectionTiles } from './utils/areValidSectionTiles';

export const Tiles: FC<TTilesProps> = ({ tiles, tileVariant }) => {
  const [slicedTiles, setSlicedTiles] = useState<TSlicedTiles>({
    sectionTop: [],
    sectionBottom: [],
  });

  useEffect(() => {
    const slicedTiles = divideLibraryTiles(tiles);

    setSlicedTiles(slicedTiles);
  }, [tiles]);

  return (
    <section>
      {tiles.length === 0 && (
        <p className="text-[2.2rem] font-extrabold text-center text-black">
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
