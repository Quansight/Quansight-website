import { Api } from '@quansight/shared/storyblok-sdk';

import { FooterItem } from '../types/basic';
import { FooterItemDocument } from '../types/hooks';
import { FooterItemQuery } from '../types/operations';

export const getFooter = async (preview: boolean): Promise<FooterItem> => {
  const { data } = await Api.getFooterItem<FooterItemQuery>(
    FooterItemDocument,
    preview,
  );

  return data.FooterItem;
};
