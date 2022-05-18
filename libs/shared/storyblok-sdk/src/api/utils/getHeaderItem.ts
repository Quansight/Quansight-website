import { ApolloQueryResult } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import * as Types from '../types/graphql';
import { HeaderItemQuery } from '../types/graphql';

export const getHeaderItem = (): Promise<
  ApolloQueryResult<HeaderItemQuery>
> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query: Types.HeaderItemDocument,
    variables: {
      slug: 'layout/header',
    },
  });
};
