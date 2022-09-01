import { ApolloQueryResult, DocumentNode } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';

export const getLinks = <ResultType>(
  query: DocumentNode,
  // We cannot pass `preview` to getLinks because it is called from
  // getStaticPaths and Next.js does not seem to pass the preview parameter to
  // getStaticPaths when preview mode is activated.
): Promise<ApolloQueryResult<ResultType>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query,
  });
};
