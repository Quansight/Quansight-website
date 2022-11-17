import { TGetLibraryTilesProps } from './types';
import { getCarouselTiles } from './utils/getCarouselTiles';
import { getLibraryLinksTiles } from './utils/getLibraryLinksTiles';
import { getLibraryPostsTiles } from './utils/getLibraryPostsTiles';
import { sortLibraryTiles } from './utils/sortLibraryTiles';

export const getLibraryTiles = ({
  libraryPosts,
  libraryLinks,
  libraryCategories,
}: TGetLibraryTilesProps) => {
  const libraryPostsTiles = getLibraryPostsTiles({
    libraryPosts,
    libraryCategories,
  });
  const libraryLinksTiles = getLibraryLinksTiles(libraryLinks);

  const carouselTiles = getCarouselTiles(libraryPostsTiles);
  const allTiles = sortLibraryTiles([
    ...libraryPostsTiles,
    ...libraryLinksTiles,
  ]);

  return { allTiles, carouselTiles };
};
