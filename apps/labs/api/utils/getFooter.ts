import { Api } from '@quansight/shared/storyblok-sdk';

import { FooterItem, FooterItemDocument, FooterItemQuery } from '..';

export const getFooter = async (): Promise<FooterItem> => {
  const { data } = await Api.getFooterItem<FooterItemQuery>(FooterItemDocument);

  return data.FooterItem;
};
