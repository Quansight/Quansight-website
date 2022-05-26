import { ApolloQueryResult, DocumentNode } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';

export const getTeamMemberBySlug = <ResultType>(
  query: DocumentNode,
  slug: string,
): Promise<ApolloQueryResult<ResultType>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query,
    variables: {
      slug: `team-members/${slug}`,
    },
  });
};
