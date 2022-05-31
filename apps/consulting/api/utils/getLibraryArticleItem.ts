import { Api } from '@quansight/shared/storyblok-sdk';

import { LibraryarticleItem } from '../types/basic';
import { LibraryArticleItemDocument } from '../types/hooks';
import {
  LibraryArticleItemQuery,
  LibraryArticleItemQueryVariables,
} from '../types/operations';

export const getLibraryArticleItem = async (
  params: LibraryArticleItemQueryVariables,
): Promise<LibraryarticleItem> => {
  const { data } = await Api.getLibraryArticleItem<
    LibraryArticleItemQuery,
    LibraryArticleItemQueryVariables
  >(LibraryArticleItemDocument, params);
  return data.LibraryarticleItem;
};
