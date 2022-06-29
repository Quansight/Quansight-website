import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: process.env['STORYBLOK_API_URL'],
  headers: {
    token: process.env['STORYBLOK_TOKEN'] || '',
    version: process.env['STORYBLOK_TOKEN_VERSION'] || 'draft',
  },

  cache: new InMemoryCache(),
});
