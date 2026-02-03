import { FC } from 'react';

import { Tile } from '../../Tiles/Tile';
import { TileVariant } from '../../Tiles/types';
import { TBlogMoreArticlesProps } from '../types';

export const BlogMoreArticles: FC<TBlogMoreArticlesProps> = ({
  featuredPosts,
}) => (
  <section className="px-[2rem] pt-[10rem] mx-auto mb-[2rem] border-t border-t-gray-100 sm:px-[6rem] sm:mb-[6rem] lg:px-[10rem] xl:px-[25rem] xl:mb-[18rem] max-w-layout">
    <h3 className="mb-[5rem] text-[1.9rem] font-bold leading-[2.7rem] text-center text-black">
      More articles from our Library
    </h3>
    <ul className="flex flex-col gap-[3.6rem] justify-between items-center sm:flex-row sm:gap-[2rem]">
      {featuredPosts.map((tile) => (
        <Tile key={tile.key} {...tile} tileVariant={TileVariant.Blog} />
      ))}
    </ul>
  </section>
);
