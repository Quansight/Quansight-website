import { AppProps } from 'next/app'
import Head from 'next/head'
import './styles.css'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to consulting!</title>
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default CustomApp
