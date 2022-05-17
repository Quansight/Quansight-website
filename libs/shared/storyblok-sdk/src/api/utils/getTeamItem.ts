import { ApolloQueryResult } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import * as Types from '../types/graphql';
import { TeamQuery } from '../types/graphql';

export const getTeamItem = (): Promise<ApolloQueryResult<TeamQuery>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query: Types.TeamDocument,
    variables: {
      slug: 'team',
    },
  });
};
