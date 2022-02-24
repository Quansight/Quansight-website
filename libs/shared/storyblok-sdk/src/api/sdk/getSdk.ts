import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'
import * as Types from '../types/graphql'

type SdkReturnType = {
  getPageItem: (
    variables: Types.Exact<{ slug: string | string[] }>,
  ) => Promise<ApolloQueryResult<any>>
}

export function getSdk(
  client: ApolloClient<NormalizedCacheObject>,
): SdkReturnType {
  return {
    getPageItem(
      variables: Types.PageItemQueryVariables,
    ): Promise<ApolloQueryResult<any>> {
      return client.query({
        fetchPolicy: 'cache-first',
        query: Types.PageItemDocument,
        variables,
      })
    },
  }
}

export type Sdk = ReturnType<typeof getSdk>
