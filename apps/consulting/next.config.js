// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/library',
        has: [
          {
            type: 'query',
            key: 'page',
            value: 'undefined',
          },
        ],
        permanent: false,
        destination: '/library?page=1',
      },
    ];
  },
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  images: {
    domains: ['a.storyblok.com'],
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://zapier.com/',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/plausible/js/script.js',
        destination: 'https://plausible.io/js/script.js',
      },
      {
        source: '/plausible/api/event',
        destination: 'https://plausible.io/api/event',
      },
    ];
  },
};

module.exports = withNx(nextConfig);
