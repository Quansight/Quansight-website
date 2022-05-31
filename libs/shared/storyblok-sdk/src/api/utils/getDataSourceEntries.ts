import { ApolloQueryResult, DocumentNode } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';

export const getDataSourceEntries = <ResultType, VariablesType>(
  query: DocumentNode,
  variables: VariablesType,
): Promise<ApolloQueryResult<ResultType>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query,
    variables,
  });
};
