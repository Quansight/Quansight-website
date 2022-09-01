import { ApolloQueryResult, DocumentNode } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import createContext from './createContext';

export const getDataSourceEntries = <ResultType, VariablesType>(
  query: DocumentNode,
  variables: VariablesType,
  preview: boolean,
): Promise<ApolloQueryResult<ResultType>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query,
    variables,
    context: createContext(preview),
  });
};
