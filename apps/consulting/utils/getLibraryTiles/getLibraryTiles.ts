import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { getBlogArticlesProps } from './getBlogArticlesProps';
import { getLibraryLinksProps } from './getLibraryLinksProps';
import { sortLibraryTiles } from './sortLibraryTiles';
import { TGetLibraryTilesProps } from './types';

const defaultValues = { items: [], total: 0 };

export const getLibraryTiles = ({
  blogArticles = defaultValues,
  libraryLinks = defaultValues,
}: TGetLibraryTilesProps): TTiles => {
  const blogArticlesProps = getBlogArticlesProps(blogArticles);
  const libraryLinksProps = getLibraryLinksProps(libraryLinks);

  const allTiles =
    blogArticlesProps && libraryLinksProps
      ? [...blogArticlesProps, ...libraryLinksProps]
      : [];

  return sortLibraryTiles(allTiles);
};
