import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: 'https://gapi.storyblok.com/v1/api',
  headers: {
    token: process.env['STORYBLOK_TOKEN'] as string,
    // The version header is set per query at run-time when Next.js is in
    // preview mode. Because we default to 'draft' here, it's important to set
    // this environment variable to 'published' in production.
    version: process.env['STORYBLOK_VERSION'] || 'draft',
  },

  cache: new InMemoryCache(),
});
