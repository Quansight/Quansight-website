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
      {
        source: '/blog',
        permanent: false,
        destination: '/library?page=1&type=blog',
      },
      {
        source: '/staffing',
        permanent: false,
        destination: '/careers',
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
    // The conventions of this return value are described in the Next.js docs:
    // https://nextjs.org/docs/api-reference/next.config.js/rewrites
    return {
      afterFiles: [
        // These rewrites are checked after pages/public files are checked but
        // before dynamic routes.
        {
          // Proxying Plausible through Vercel:
          // https://plausible.io/docs/proxy/guides/vercel

          // `p7e` stands for Plausible. Why not just use `plausible`? The docs
          // say: Choose a generic or irrelevant name for the subdirectory. If
          // you choose something like analytics or plausible, it might get
          // blocked in the future.
          source: '/p7e/js/script.js',
          destination: 'https://plausible.io/js/script.js',
        },
        {
          source: '/p7e/api/event',
          destination: 'https://plausible.io/api/event',
        },
      ],
    };
  },
};

module.exports = withNx(nextConfig);
