import { ApolloQueryResult } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import * as Types from '../types/graphql';
import { PageItemQuery } from '../types/graphql';

export const getPageItem = (
  variables: Types.PageItemQueryVariables,
): Promise<ApolloQueryResult<PageItemQuery>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query: Types.PageItemDocument,
    variables,
  });
};
