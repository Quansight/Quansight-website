import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

type Props = {};

class Document extends NextDocument<Props> {
  render(): JSX.Element {
    return (
      <Html lang="en" className="text-[62.5%]">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Mukta:wght@800&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
