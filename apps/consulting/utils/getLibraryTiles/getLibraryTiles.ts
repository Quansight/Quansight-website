import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { defaultTilesValues } from './constants';
import { getBlogArticlesProps } from './getBlogArticlesProps';
import { getLibraryLinksProps } from './getLibraryLinksProps';
import { sortLibraryTiles } from './sortLibraryTiles';
import { TGetLibraryTilesProps } from './types';

export const getLibraryTiles = ({
  blogArticles = defaultTilesValues,
  libraryLinks = defaultTilesValues,
}: TGetLibraryTilesProps): TTiles => {
  const blogArticlesProps = getBlogArticlesProps(blogArticles);
  const libraryLinksProps = getLibraryLinksProps(libraryLinks);

  const allTiles =
    blogArticlesProps && libraryLinksProps
      ? [...blogArticlesProps, ...libraryLinksProps]
      : [];

  return sortLibraryTiles(allTiles);
};
