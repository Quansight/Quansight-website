// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
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
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
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

        // Proxying Plausible through Vercel
        // https://plausible.io/docs/proxy/guides/vercel
        {
          source: '/plausible/js/script.js',
          destination: 'https://plausible.io/js/script.js',
        },
        {
          source: '/plausible/api/event',
          destination: 'https://plausible.io/api/event',
        },
      ],
      fallback: [
        // These rewrites are checked after both pages/public files and dynamic
        // routes are checked.
        {
          source: '/:file(.+\\..+)',
          destination: 'https://quansight-labs.netlify.app/:file',
        },
        {
          // Why is /archive an anomaly on Netlify site?
          // On Netlify, /2022 redirects to /2022/
          // But then on same Netlify site, /archive/ redirects to /archive
          // WTF.
          source: '/archive',
          destination: 'https://quansight-labs.netlify.app/archive',
        },
        {
          source: '/:path*',
          destination: 'https://quansight-labs.netlify.app/:path*/',
        },
      ],
    };
  },
};

module.exports = withNx(nextConfig);
