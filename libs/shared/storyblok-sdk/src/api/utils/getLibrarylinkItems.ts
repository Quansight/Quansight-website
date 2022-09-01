import { ApolloQueryResult, DocumentNode } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import createContext from './createContext';

export const getLibraryLinkItems = <ReturnType>(
  query: DocumentNode,
  preview: boolean,
): Promise<ApolloQueryResult<ReturnType>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query,
    context: createContext(preview),
  });
};
