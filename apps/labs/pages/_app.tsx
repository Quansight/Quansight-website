import { AppProps } from 'next/app';
import Script from 'next/script';

import { Meta } from '@quansight/shared/ui-components';
import './styles.css';
import '@code-hike/mdx/dist/index.css';

function CustomApp({ Component, pageProps }: AppProps): JSX.Element {
  const labsDomain = 'labs.quansight.org';
  return (
    <>
      <Meta />
      <Component {...pageProps} />

      {typeof window !== 'undefined' &&
        window.location.hostname === labsDomain && (
          // For more info about this script, see note in consulting/next.config.js
          <Script
            data-domain={labsDomain}
            data-api="/p7e/api/event"
            src="/p7e/js/script.js"
          />
        )}
    </>
  );
}

export default CustomApp;
