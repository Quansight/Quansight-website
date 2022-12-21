import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { enabledPostTypes } from '../constants';
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

  const filteredLibraryLinksProps = libraryLinksProps.filter((libraryLink) =>
    enabledPostTypes.includes(libraryLink.postType),
  );

  const allTiles =
    blogArticlesProps && filteredLibraryLinksProps
      ? [...blogArticlesProps, ...filteredLibraryLinksProps]
      : [];

  return sortLibraryTiles(allTiles);
};
