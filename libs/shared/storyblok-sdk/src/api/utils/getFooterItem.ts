import { ApolloQueryResult } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import * as Types from '../types/graphql';
import { FooterItemQuery } from '../types/graphql';

export const getFooterItem = (): Promise<
  ApolloQueryResult<FooterItemQuery>
> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query: Types.FooterItemDocument,
    variables: {
      slug: 'layout/footer',
    },
  });
};
