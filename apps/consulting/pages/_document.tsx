import { FC } from 'react';

import { Html, Head, Main, NextScript } from 'next/document';

const Document: FC = () => {
  return (
    <Html lang="en" className="text-[62.5%]">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;700;800&family=Mukta:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script
          defer
          data-domain="yourdomain.com" // TODO to be changed before deploy
          data-api="/plausible/api/event"
          src="/plausible/js/script.js"
        />
      </body>
    </Html>
  );
};

export default Document;
