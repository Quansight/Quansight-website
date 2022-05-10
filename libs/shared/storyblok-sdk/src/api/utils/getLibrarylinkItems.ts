import { ApolloQueryResult } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import * as Types from '../types/graphql';
import { LibrarylinkItemsQuery } from '../types/graphql';

export const getLibraryLinkItems = (): Promise<
  ApolloQueryResult<LibrarylinkItemsQuery>
> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query: Types.LibrarylinkItemsDocument,
  });
};
