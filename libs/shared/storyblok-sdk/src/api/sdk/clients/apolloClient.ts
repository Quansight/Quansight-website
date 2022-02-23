import { ApolloClient, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
  uri: 'https://gapi.storyblok.com/v1/api',
  headers: {
    token: process.env['STORYBLOK_PREVIEW_TOKEN'] || '',
    version: 'draft',
  },

  cache: new InMemoryCache(),
})
