import { FC } from 'react';
import { TSEOProps, DomainVariant } from './types';
import Head from 'next/head';

export const SEO: FC<TSEOProps> = ({ title, description, variant }) => (
  <Head>
    <title>{`${title} | ${DomainVariant[variant]}`}</title>
    <meta name="description" content={description} />
  </Head>
);
