import { FC } from 'react';

import { Tile } from '../../Tiles/Tile';
import { TileVariant } from '../../Tiles/types';
import { TBlogMoreArticlesProps } from '../types';

export const BlogMoreArticles: FC<TBlogMoreArticlesProps> = ({
  featuredPosts,
}) => (
  <section className="max-w-layout mx-auto mb-[2rem] border-t border-t-gray-100 px-[2rem] pt-[10rem] sm:mb-[6rem] sm:px-[6rem] lg:px-[10rem] xl:mb-[18rem] xl:px-[25rem]">
    <h3 className="mb-[5rem] text-center text-[1.9rem] font-bold leading-[2.7rem] text-black">
      More articles from our Library
    </h3>
    <ul className="flex flex-col items-center justify-between gap-[3.6rem] sm:flex-row sm:gap-[2rem]">
      {featuredPosts.map((tile) => (
        <Tile key={tile.key} {...tile} tileVariant={TileVariant.Blog} />
      ))}
    </ul>
  </section>
);
