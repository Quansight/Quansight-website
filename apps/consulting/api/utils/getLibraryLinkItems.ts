import { Api } from '@quansight/shared/storyblok-sdk';

import { LibrarylinkItems } from '../types/basic';
import { LibrarylinkItemsDocument } from '../types/hooks';
import { LibrarylinkItemsQuery } from '../types/operations';

export const getLibraryLinkItems = async (
  preview: boolean,
): Promise<LibrarylinkItems> => {
  const { data } = await Api.getLibraryLinkItems<LibrarylinkItemsQuery>(
    LibrarylinkItemsDocument,
    preview,
  );
  return data.LibrarylinkItems;
};
