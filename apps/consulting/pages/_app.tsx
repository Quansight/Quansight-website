import { AppProps } from 'next/app';
import Script from 'next/script';

import { Meta } from '@quansight/shared/ui-components';

import './styles.css';

const gtag_global_snippet = `
<!-- Google tag (gtag.js) - Google Ads -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-722597110"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-722597110');
</script>
`;

const gtag_event_snippet = `
<!-- Event snippet for Click Submit on Lightbox conversion page
In your html page, add the snippet and call gtag_report_conversion when someone clicks on the chosen link or button. -->
<script>
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
</script>
`;

const global_script = document.createElement('script');
global_script.innerHTML = gtag_global_snippet;

const event_script = document.createElement('script');
event_script.innerHTML = gtag_event_snippet;

document.head.insertBefore(event_script, document.head.childNodes[0]);
document.head.insertBefore(global_script, document.head.childNodes[0]);

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
