import { ApolloQueryResult } from '@apollo/client';
import * as Types from '../types/graphql';
import { LinksQuery } from '../types/graphql';
import { apolloClient } from '../sdk/clients/apolloClient';

export const getLinks = (): Promise<ApolloQueryResult<LinksQuery>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query: Types.LinksDocument,
  });
};
