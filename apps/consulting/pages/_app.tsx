import { AppProps } from 'next/app';
import { Meta } from '@quansight/shared/ui-components';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Meta />
      <Component {...pageProps} />
    </>
  );
}

export default CustomApp;
