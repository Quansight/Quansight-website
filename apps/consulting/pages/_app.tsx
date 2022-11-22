import { AppProps } from 'next/app';
import Script from 'next/script';

import { Meta } from '@quansight/shared/ui-components';

import './styles.css';

function CustomApp({ Component, pageProps }: AppProps): JSX.Element {
  const consultingDomain = 'quansight.com';
  return (
    <>
      <Meta />
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
