import { ApolloQueryResult } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import * as Types from '../types/graphql';
import { LinksQuery } from '../types/graphql';

export const getLinks = (): Promise<ApolloQueryResult<LinksQuery>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query: Types.LinksDocument,
  });
};
