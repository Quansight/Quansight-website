import { PageItems } from '../../api/types/basic';
import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { defaultTilesValues } from './constants';
import { getBlogArticlesProps } from './getBlogArticlesProps';
import { sliceCarouselTiles } from './sliceCarouselTiles';
import { sortLibraryTiles } from './sortLibraryTiles';

export const getCarouselTiles = (
  blogArticles: PageItems = defaultTilesValues,
): TTiles => {
  const blogArticlesProps = getBlogArticlesProps(blogArticles);
  const sortedLibraryTiles = sortLibraryTiles(blogArticlesProps);
  return sliceCarouselTiles(sortedLibraryTiles);
};
