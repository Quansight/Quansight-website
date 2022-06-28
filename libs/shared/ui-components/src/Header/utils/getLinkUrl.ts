import { Maybe } from 'graphql/jsutils/Maybe';

import { TLink } from '@quansight/shared/types';

export const getLinkUrl = (
  queryParams: Maybe<string>,
  linkUrl: TLink,
): string => {
  const isHomePageSlug =
    linkUrl.cached_url === 'homepage' || linkUrl.cached_url === 'home';
  const baseUrl = isHomePageSlug ? '/' : linkUrl.cached_url;
  return queryParams ? `/${baseUrl}${queryParams}` : `/${baseUrl}`;
};
