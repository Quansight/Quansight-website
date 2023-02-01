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
      {
        // Next.js serves any file in the public folder whose type it does not
        // recognize with the following HTTP header:
        //
        //   Content-Type: application/octet-stream
        //
        // The following rule catches some plain text file types that we link
        // to, and supplies the text/plain MIME type in the Content-Type header.
        source: '/:path*(.py|.cpp)',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
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
      beforeFiles: [
        {
          source: '/annual-report.pdf',
          destination: '/api/annual-report.pdf',
        },
      ],
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
          destination: 'https://plausible.io/js/script.file-downloads.js',
        },
        {
          source: '/p7e/api/event',
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
