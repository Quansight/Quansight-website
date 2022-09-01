import { ApolloQueryResult, DocumentNode } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import createContext from './createContext';

export const getFooterItem = <ResultType>(
  query: DocumentNode,
  preview: boolean,
): Promise<ApolloQueryResult<ResultType>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query,
    variables: {
      slug: 'layout/footer',
    },
    context: createContext(preview),
  });
};
