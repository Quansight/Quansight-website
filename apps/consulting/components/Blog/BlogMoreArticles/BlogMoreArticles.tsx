import { FC } from 'react';

import { Tile } from '../../Tiles/Tile';
import { TileVariant } from '../../Tiles/types';
import { TBlogMoreArticlesProps } from '../types';

export const BlogMoreArticles: FC<TBlogMoreArticlesProps> = ({ tiles }) => {
  return (
    <footer className="pt-[10rem] mb-[2rem] border-t border-t-gray-100 sm:mb-[6rem] xl:mb-[18rem]">
      <h3 className="mb-[5rem] text-[1.9rem] font-bold leading-[2.7rem] text-center text-black">
        More articles from our Library
      </h3>
      <ul className="flex flex-col gap-[3.6rem] justify-between items-center sm:flex-row sm:gap-[2rem]">
        {tiles.map((tile) => (
          <Tile key={tile.uuid} {...tile} tileVariant={TileVariant.Blog} />
        ))}
      </ul>
    </footer>
  );
};
