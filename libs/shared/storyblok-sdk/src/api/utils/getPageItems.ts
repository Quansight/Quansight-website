import { ApolloQueryResult, DocumentNode } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import createHeaders from './createHeaders';

export const getPageItems = <ResultType, VariablesType>(
  query: DocumentNode,
  variables: VariablesType,
  preview: boolean,
): Promise<ApolloQueryResult<ResultType>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query,
    variables,
    context: {
      headers: createHeaders(preview),
    },
  });
};
