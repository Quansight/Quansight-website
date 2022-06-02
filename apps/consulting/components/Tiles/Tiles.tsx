import { FC, useState, useEffect } from 'react';

import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { divideLibraryTiles } from '../../utils/divideLibraryTiles/divideLibraryTiles';
import { Newsletter } from '../Newsletter/Newsletter';
import { Tile } from './Tile';
import { TTilesProps } from './types';

export const Tiles: FC<TTilesProps> = ({ tiles, tileVariant }) => {
  const [slicedTiles, setSlicedTiles] = useState<{
    sectionTop: TTiles;
    sectionBottom: TTiles;
  }>({
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
      {slicedTiles.sectionTop.length !== 0 && (
        <ul className="grid grid-cols-1 gap-[4.2rem] sm:grid-cols-2 sm:gap-x-[2.4rem] sm:gap-y-[3.6rem] lg:grid-cols-3">
          {slicedTiles.sectionTop.map((tile) => (
            <Tile {...tile} key={tile.uuid} tileVariant={tileVariant} />
          ))}
        </ul>
      )}
      <Newsletter />
      {slicedTiles.sectionBottom.length !== 0 && (
        <ul className="grid grid-cols-1 gap-[4.2rem] sm:grid-cols-2 sm:gap-x-[2.4rem] sm:gap-y-[3.6rem] lg:grid-cols-3">
          {slicedTiles.sectionBottom.map((tile) => (
            <Tile {...tile} key={tile.uuid} tileVariant={tileVariant} />
          ))}
        </ul>
      )}
    </section>
  );
};
