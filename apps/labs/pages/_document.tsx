import { FC } from 'react';

import { Html, Head, Main, NextScript } from 'next/document';

const Document: FC = () => {
  return (
    <Html lang="en" className="text-[62.5%]">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;700;800&family=Mukta:wght@400;500;700;800&family=Fira+Code:wght@500&display=swap"
          rel="stylesheet"
        />
        <link rel="shortcut icon" href="/favicon.png" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
