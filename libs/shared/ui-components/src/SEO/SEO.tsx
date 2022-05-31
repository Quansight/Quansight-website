import { FC } from 'react';

import Head from 'next/head';

import { DomainVariant } from '@quansight/shared/types';

import { TSEOProps } from './types';

export const SEO: FC<TSEOProps> = ({ title, description, variant }) => (
  <Head>
    <title>{`${title} | ${DomainVariant[variant]}`}</title>
    <meta name="description" content={description} />
  </Head>
);
