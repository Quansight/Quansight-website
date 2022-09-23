import { ApolloQueryResult, DocumentNode } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import createContext from './createContext';

export const getTeamMemberBySlug = <ResultType>(
  query: DocumentNode,
  slug: string,
  preview: boolean,
): Promise<ApolloQueryResult<ResultType>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query,
    variables: {
      slug: `team-members/${slug}`,
    },
    context: createContext(preview),
  });
};
