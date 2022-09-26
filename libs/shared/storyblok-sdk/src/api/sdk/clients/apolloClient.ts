import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: 'https://gapi.storyblok.com/v1/api',
  headers: {
    token: process.env['NEXT_PUBLIC_STORYBLOK_TOKEN'] as string,
    // The version header is set per query at run-time when Next.js is in
    // preview mode, but the static build of the site will always use
    // 'published' content.
    version: 'published',
  },

  cache: new InMemoryCache(),
});
