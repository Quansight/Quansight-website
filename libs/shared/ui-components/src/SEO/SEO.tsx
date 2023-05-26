import { FC } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { DomainVariant } from '@quansight/shared/types';

import { TSEOProps } from './types';

export const SEO: FC<TSEOProps> = ({ title, description, variant }) => {
  const { asPath } = useRouter();
  const origin =
    DomainVariant[variant] === 'Quansight'
      ? 'quansight.com'
      : 'labs.quansight.com';
  const url = `${origin}${asPath}`;

  return (
    <Head>
      <title>{`${title} | ${DomainVariant[variant]}`}</title>
      <meta name="description" content={description} />

      {/* twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@quansightai" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* This img will get updated in the future if headers send their own img we can use that */}
      <meta
        name="twitter:image"
        content={
          DomainVariant[variant] === 'Quansight'
            ? 'https://a.storyblok.com/f/147759/1200x630/ce491624ae/quansight-logo-opengraph.png'
            : 'https://a.storyblok.com/f/152463/900x472/fe2083b744/qslabs-logo-opengraph.png'
        }
      />
      <meta
        name="twitter:alt"
        content={
          DomainVariant[variant] === 'Quansight'
            ? 'Quansight logo'
            : 'Quansight labs logo'
        }
      />

      {/* open-graph / LinkedIn Specification */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta
        property="og:image"
        content={
          DomainVariant[variant] === 'Quansight'
            ? 'https://a.storyblok.com/f/147759/1200x630/ce491624ae/quansight-logo-opengraph.png'
            : 'https://a.storyblok.com/f/152463/900x472/fe2083b744/qslabs-logo-opengraph.png'
        }
      />
    </Head>
  );
};
