import { Api } from '@quansight/shared/storyblok-sdk';

import { LibrarylinkItems } from '../types/basic';
import { LibrarylinkItemsDocument } from '../types/hooks';
import { LibrarylinkItemsQuery } from '../types/operations';

export const getLibraryLinkItems = async (): Promise<
  LibrarylinkItems['items']
> => {
  const { data } = await Api.getLibraryLinkItems<LibrarylinkItemsQuery>(
    LibrarylinkItemsDocument,
  );
  return data.LibrarylinkItems.items;
};
