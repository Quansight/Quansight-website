import { ApolloQueryResult, DocumentNode } from '@apollo/client';

import { apolloClient } from '../sdk/clients/apolloClient';
import createHeaders from './createHeaders';

export const getFooterItem = <ResultType>(
  query: DocumentNode,
  preview: boolean,
): Promise<ApolloQueryResult<ResultType>> => {
  return apolloClient.query({
    fetchPolicy: 'cache-first',
    query,
    variables: {
      slug: 'layout/footer',
    },
    context: {
      headers: createHeaders(preview),
    },
  });
};
