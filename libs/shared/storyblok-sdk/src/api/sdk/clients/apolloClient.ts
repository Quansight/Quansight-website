import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: process.env['STORYBLOK_API_URL'],
  headers: {
    token: process.env['STORYBLOK_PREVIEW_TOKEN'] || '',
    version: 'draft',
  },

  cache: new InMemoryCache(),
});
