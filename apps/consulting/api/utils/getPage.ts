import { Api } from '@quansight/shared/storyblok-sdk';

import { PageItem } from '../types/basic';
import { PageItemDocument } from '../types/hooks';
import { PageItemQuery, PageItemQueryVariables } from '../types/operations';

export const getPage = async (
  variables: PageItemQueryVariables,
  preview,
): Promise<PageItem> => {
  const { data } = await Api.getPageItem<PageItemQuery, PageItemQueryVariables>(
    PageItemDocument,
    variables,
    preview,
  );
  return data.PageItem;
};
