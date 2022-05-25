import { ApolloQueryResult, DocumentNode } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';

export const getLibraryArticleItem = <ReturnType, VariablesType>(
  query: DocumentNode,
  variables: VariablesType,
): Promise<ApolloQueryResult<ReturnType>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query,
    variables,
  });
};
