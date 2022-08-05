import { FC } from 'react';

import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

const Document: FC = () => {
  return (
    <Html lang="en" className="text-[62.5%]">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;700;800&family=Mukta:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="shortcut icon"
          href="/favicon.png"
        />
        {/* <!-- Global site tag (gtag.js) - Google Ads: 722597110 --> */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-722597110"
        />
        <Script> 
          {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-722597110');
          }
        </Script>
        {/* <-- Event snippet for Click Submit on Lightbox (now Form Submit) conversion */}
        <Script>
          {
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                  'send_to': 'AW-722597110/TEbJCM3O4LQBEPbpx9gC',
                  'event_callback': callback
              });
              return false;
            }
          }
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
