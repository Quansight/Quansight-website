import { Api } from '@quansight/shared/storyblok-sdk';

import { FooterItem, FooterItemDocument, FooterItemQuery } from '..';

export const getFooter = async (preview: boolean): Promise<FooterItem> => {
  const { data } = await Api.getFooterItem<FooterItemQuery>(
    FooterItemDocument,
    preview,
  );

  return data.FooterItem;
};
