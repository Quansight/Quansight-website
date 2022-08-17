import { AppProps } from 'next/app';
import Script from 'next/script';

import { Meta } from '@quansight/shared/ui-components';

import './styles.css';

function CustomApp({ Component, pageProps }: AppProps): JSX.Element {
  const consultingDomain = 'quansight.com';
  return (
    <>
      <Meta />
      <Script
        id="gtag-global"
        src="https://www.googletagmanager.com/gtag/js?id=AW-722597110"
      />
      <Script id="gtag-setup" src="gtag.js" />
      <Component {...pageProps} />

      {typeof window !== 'undefined' &&
        window.location.hostname === consultingDomain && (
          // For more info about this script, see note in consulting/next.config.js
          <Script
            data-domain={consultingDomain}
            data-api="/p7e/api/event"
            src="/p7e/js/script.js"
          />
        )}
    </>
  );
}

export default CustomApp;
