import { LibrarylinkItems } from '../../../api/types/basic';
import { TPostsResponse } from '../../../types/storyblok/bloks/blogPost';
import { TLibraryFilter } from '../../../types/utils/LibraryFilter';

export type TGetLibraryPostsTiles = {
  libraryPosts: TPostsResponse;
  libraryCategories: TLibraryFilter;
};

export type TGetLibraryTilesProps = {
  libraryLinks: LibrarylinkItems;
} & TGetLibraryPostsTiles;
