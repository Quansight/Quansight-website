import { TGetLibraryTilesProps } from './types';
import { getCarouselTiles } from './utils/getCarouselTiles';
import { getLibraryPostsTiles } from './utils/getLibraryPostsTiles';

export const getLibraryTiles = ({
  libraryPosts,
  // libraryLinks,
  libraryCategories,
}: TGetLibraryTilesProps) => {
  const libraryPostsTiles = getLibraryPostsTiles({
    libraryPosts,
    libraryCategories,
  });
  // const libraryLinksTiles = [];

  const carouselTiles = getCarouselTiles(libraryPostsTiles);
  const allTiles = [...libraryPostsTiles];

  return { allTiles, carouselTiles };
};
