import { Api } from '@quansight/shared/storyblok-sdk';

import { PageItems } from '../types/basic';
import { PageItemsDocument } from '../types/hooks';
import { PageItemsQuery, PageItemsQueryVariables } from '../types/operations';

export const getPageItems = async (
  variables: PageItemsQueryVariables,
): Promise<PageItems> => {
  const { data } = await Api.getPageItems<
    PageItemsQuery,
    PageItemsQueryVariables
  >(PageItemsDocument, variables);
  return data.PageItems;
};
