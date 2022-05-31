import { Maybe } from 'graphql/jsutils/Maybe';

import { TLink } from '@quansight/shared/types';

export const getLinkUrl = (
  queryParams: Maybe<string>,
  linkUrl: TLink,
): string =>
  queryParams
    ? `/${linkUrl.cached_url}${queryParams}`
    : `/${linkUrl.cached_url}`;
