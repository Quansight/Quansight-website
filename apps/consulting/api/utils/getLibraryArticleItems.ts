import { Api } from '@quansight/shared/storyblok-sdk';

import { LibraryarticleItems } from '../types/basic';
import { LibraryArticleItemsDocument } from '../types/hooks';
import { LibraryArticleItemsQuery } from '../types/operations';

export const getLibraryArticleItems =
  async (): Promise<LibraryarticleItems> => {
    const { data } = await Api.getLibraryArticleItems<LibraryArticleItemsQuery>(
      LibraryArticleItemsDocument,
    );
    return data.LibraryarticleItems;
  };
