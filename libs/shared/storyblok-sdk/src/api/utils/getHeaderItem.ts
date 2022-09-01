import { ApolloQueryResult, DocumentNode } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import createContext from './createContext';

export const getHeaderItem = <ResultType>(
  query: DocumentNode,
  preview: boolean,
): Promise<ApolloQueryResult<ResultType>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query,
    variables: {
      slug: 'layout/header',
    },
    context: createContext(preview),
  });
};
