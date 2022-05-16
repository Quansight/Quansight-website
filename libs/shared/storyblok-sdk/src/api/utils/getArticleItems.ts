import { ApolloQueryResult } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import * as Types from '../types/graphql';
import { ArticleItemsQuery } from '../types/graphql';

export const getArticleItems = (): Promise<
  ApolloQueryResult<ArticleItemsQuery>
> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query: Types.ArticleItemsDocument,
  });
};
