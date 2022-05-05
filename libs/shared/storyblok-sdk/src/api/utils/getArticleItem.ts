import * as Types from '../types/graphql';
import { ApolloQueryResult } from '@apollo/client';
import { ArticleItemQuery } from '../types/graphql';
import { apolloClient } from '../sdk/clients/apolloClient';

export const getArticleItem = (
  variables: Types.ArticleItemQueryVariables,
): Promise<ApolloQueryResult<ArticleItemQuery>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query: Types.ArticleItemDocument,
    variables,
  });
};
