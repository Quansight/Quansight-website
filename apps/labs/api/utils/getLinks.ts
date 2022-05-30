import { Api } from '@quansight/shared/storyblok-sdk';

import { LinkEntry } from '../types/basic';
import { LinksDocument } from '../types/hooks';
import { LinksQuery } from '../types/operations';

export const getLinks = async (): Promise<
  Pick<LinkEntry, 'id' | 'isFolder' | 'name' | 'slug'>[]
> => {
  const { data } = await Api.getLinks<LinksQuery>(LinksDocument);
  return data.Links.items;
};
