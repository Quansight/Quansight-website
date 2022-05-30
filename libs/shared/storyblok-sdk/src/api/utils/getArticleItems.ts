import { ApolloQueryResult, DocumentNode } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';

export const getArticleItems = <ReturnType>(
  query: DocumentNode,
): Promise<ApolloQueryResult<ReturnType>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query,
  });
};
