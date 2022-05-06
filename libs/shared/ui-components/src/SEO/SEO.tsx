import { FC } from 'react';

import Head from 'next/head';

import { TSEOProps, DomainVariant } from './types';

export const SEO: FC<TSEOProps> = ({ title, description, variant }) => (
  <Head>
    <title>{`${title} | ${DomainVariant[variant]}`}</title>
    <meta name="description" content={description} />
  </Head>
);
