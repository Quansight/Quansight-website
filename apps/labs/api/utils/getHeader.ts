import { Api } from '@quansight/shared/storyblok-sdk';

import { HeaderItem } from '../types/basic';
import { HeaderItemDocument } from '../types/hooks';
import { HeaderItemQuery } from '../types/operations';

export const getHeader = async (preview: boolean): Promise<HeaderItem> => {
  const { data } = await Api.getHeaderItem<HeaderItemQuery>(
    HeaderItemDocument,
    preview,
  );

  return data.HeaderItem;
};
