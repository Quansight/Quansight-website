import { ApolloQueryResult } from '@apollo/client';
import * as Types from '../types/graphql';
import { LayoutItemQuery } from '../types/graphql';
import { apolloClient } from '../sdk/clients/apolloClient';

export const getLayoutItem = (
  variables: Types.PageItemQueryVariables,
): Promise<ApolloQueryResult<LayoutItemQuery>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query: Types.LayoutItemDocument,
    variables,
  });
};
