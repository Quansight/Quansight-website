import { ApolloQueryResult } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import * as Types from '../types/graphql';
import { ArticleItemQuery } from '../types/graphql';

export const getArticleItem = (
  variables: Types.ArticleItemQueryVariables,
): Promise<ApolloQueryResult<ArticleItemQuery>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query: Types.ArticleItemDocument,
    variables,
  });
};
