import { FC } from 'react';

import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

const Document: FC = () => {
  return (
    <Html lang="en" className="text-[62.5%]">
      <Head>
        <Script id="session-store-url-params" strategy="beforeInteractive">
          {`
            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            for (const param in params) {
              if (
                param.toLowerCase().startsWith('gclid') || 
                param.toLowerCase().startsWith('utm_')
                ) {
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
