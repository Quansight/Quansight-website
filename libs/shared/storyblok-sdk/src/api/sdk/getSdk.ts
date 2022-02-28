import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client';
import * as Types from '../types/graphql';
import { LinksQuery, PageItemQuery } from '../types/graphql';

type SdkReturnType = {
  getPageItem: (
    variables: Types.PageItemQueryVariables,
  ) => Promise<ApolloQueryResult<PageItemQuery>>;
  getLinks: () => Promise<ApolloQueryResult<LinksQuery>>;
};

export function getSdk(
  client: ApolloClient<NormalizedCacheObject>,
): SdkReturnType {
  return {
    getPageItem(
      variables: Types.PageItemQueryVariables,
    ): Promise<ApolloQueryResult<PageItemQuery>> {
      return client.query({
        fetchPolicy: 'cache-first',
        query: Types.PageItemDocument,
        variables,
      });
    },
    getLinks(): Promise<ApolloQueryResult<LinksQuery>> {
      return client.query({
        fetchPolicy: 'cache-first',
        query: Types.LinksDocument,
      });
    },
  };
}

export type Sdk = ReturnType<typeof getSdk>;
