import { FC } from 'react';

import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

const Document: FC = () => {
  return (
    <Html lang="en" className="text-[62.5%]">
      <Head>
        {/*
          This script collects any GCLID and UTM query parameters from incoming
          traffic and stores them in `sessionStorage`. It uses a 'quansight_'
          prefix on the names of all stored parameters to reduce the possibility
          of collision with other sites that might be using sessionStorage for
          similar purposes.

          Search params approach from https://stackoverflow.com/a/901144/4376000.
        */}
        <Script id="session-store-url-params" strategy="beforeInteractive">
          {`
            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            for (const param in params) {
              if (
                param.toLowerCase().startsWith('gclid') ||
                param.toLowerCase().startsWith('utm_')
                ) {
                  // Prefix with 'quansight_' to minimize possible name collisions
                  window.sessionStorage.setItem('quansight_' + param, params[param])
                }
            }
          `}
        </Script>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;700;800&family=Mukta:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
