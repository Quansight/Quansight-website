import { isValidArray } from '@quansight/shared/utils';

import { TTiles } from '../../../../types/storyblok/bloks/libraryProps';
import { LinkTarget } from '../../../../types/storyblok/bloks/libraryProps';
import { POST_SLUG_DEFAULT_PREFIX } from '../../constants';
import { TGetLibraryPostsTiles } from '../types';

export const getLibraryPostsTiles = ({
  libraryPosts,
  libraryCategories,
}: TGetLibraryPostsTiles): TTiles => {
  const libraryPostsRawItems = libraryPosts?.items;

  if (isValidArray(libraryPostsRawItems)) {
    return libraryPostsRawItems.map(({ meta, slug }) => ({
      title: meta?.title,
      key: slug,
      link: {
        linkUrl: `/${POST_SLUG_DEFAULT_PREFIX}/${slug}`,
        linkType: LinkTarget.Internal,
      },
      imageSrc: meta?.featuredImage?.src,
      imageAlt: meta?.featuredImage?.alt,
      postType: 'blog',
      postCategory: meta?.category.map(
        (categoryName) =>
          libraryCategories.find(({ name }) => name === categoryName)?.value ||
          categoryName,
      ),
      author: meta?.author?.fullName,
      date: meta?.published,
    }));
  }

  return [];
};
