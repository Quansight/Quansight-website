// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            /* The purpose of this redirect is to take all traffic entering at
               https://labs.quansight.com/:path and redirect it to
               https://labs.quansight.org/:path. The value here is a regex
               matching the host of an incoming request, which will find
               the initial `labs.` of https://labs.quansight.com.

               The reason why a literal `labs.quansight.com` was not used
               was to allow testing of the redirect before deployment.
               During work on the PR, a temporary Vercel deployment was
               created with a `labs-` prefix on the domain, to trigger
               this redirect. (Vercel does not allow multiple layers of
               subdomains on deployment URLs, so a `labs.` prefix
               was not an option.) This is why the regex includes the `[.-]`
               character class, instead of just `\\.` to match a period.

               While a tighter scope on this host regex match would probably
               be ideal, since we are not planning on using anything other
               than the apex quansight.com domain for the website
               this configuration should not cause problems.

               Note that this redirect configuration requires that *BOTH*
               `quansight.com` *and* `labs.quansight.com` be configured
               as active domains for the `main` branch under the Vercel
               project responsible for live deployment of the website.
               Otherwise, incoming traffic to `labs.quansight.com/:path`
               will receive a Vercel "no deployment at this address"
               404 error.

               This redirect is placed first in the sequence so that
               all incoming traffic to a labs.quansight.com/:path is
               forwarded to labs.quansight.org/:path without being
               modified by the other redirects below.
             */
            type: 'host',
            value: '^labs[.-].+',
          },
        ],
        permanent: true,
        destination: 'https://labs.quansight.org/:path*',
      },
      {
        source: '/labs',
        permanent: true,
        destination: 'https://labs.quansight.org',
      },
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
        source: '/staffing',
        permanent: true,
        destination: '/careers',
      },
      {
        source: '/blog',
        permanent: true,
        destination: '/library?page=1&type=blog',
      },
      {
        source: '/post/rapids-cucim-porting-scikit-image-code-to-the-gpu',
        permanent: true,
        destination: '/post/performance-for-image-processing-with-cucim',
      },
      {
        source: '/post/will-python-be-1-forever',
        permanent: true,
        destination: '/post/python-forever',
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
