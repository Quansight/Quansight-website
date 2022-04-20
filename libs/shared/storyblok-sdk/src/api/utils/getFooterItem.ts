import { ApolloQueryResult } from '@apollo/client';
import * as Types from '../types/graphql';
import { FooterItemQuery } from '../types/graphql';
import { apolloClient } from '../sdk/clients/apolloClient';

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
