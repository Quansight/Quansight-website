import * as Types from '../types/graphql';
import { ApolloQueryResult } from '@apollo/client';
import { PageItemQuery } from '../types/graphql';
import { apolloClient } from '../sdk/clients/apolloClient';

export const getPageItem = (
  variables: Types.PageItemQueryVariables,
): Promise<ApolloQueryResult<PageItemQuery>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query: Types.PageItemDocument,
    variables,
  });
};
