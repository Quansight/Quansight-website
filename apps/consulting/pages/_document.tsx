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
          
          'afterInteractive' strategy chosen here to minimize any reduction of
          page load speed. It seems unlikely that anything could happen to disrupt
          the UTM parameters in the `window.location` prior to their capture here.
        */}
        <Script id="session-store-url-params" strategy="afterInteractive">
          {`
            const urlSearchParams = new URLSearchParams(window.location.search);
            for (const [key, value] of urlSearchParams) {
              if (
                /* The GCLID capture is disabled for now, since we're not sure how
                   extensively we will be running Google Ads, and it simplifies any
                   privacy questions to omit its capture.
                */
                // key.toLowerCase().startsWith('gclid') ||
                key.toLowerCase().startsWith('utm_')
                ) {
                  window.sessionStorage.setItem(key, value);
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
