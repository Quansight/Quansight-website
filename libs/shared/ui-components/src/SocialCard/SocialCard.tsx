import { FC } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { DomainVariant } from '@quansight/shared/types';

import { TSocialCardProps } from './types';

export const SocialCard: FC<TSocialCardProps> = ({
  title,
  description,
  variant,
  twitterImage,
  ogImage,
  alt,
  summaryLargeImage = true,
}) => {
  const { asPath } = useRouter();

  const url = `https://${process.env['NEXT_PUBLIC_VERCEL_URL']}${asPath}`;

  const defaultTwitterImage = (variant: DomainVariant): string => {
    switch (variant) {
      case DomainVariant.Quansight:
        return 'https://a.storyblok.com/f/147759/1200x630/8b20f86b2a/quansight-logo-opengraph-size.png';
      case DomainVariant.Labs:
        return 'https://a.storyblok.com/f/152463/900x472/b289c484e3/qslabs-logo-opengraph-size.png';
      default:
        return '';
    }
  };
  const defaultOgImage = (variant: DomainVariant): string => {
    switch (variant) {
      case DomainVariant.Quansight:
        return 'https://a.storyblok.com/f/147759/1200x630/8b20f86b2a/quansight-logo-opengraph-size.png';
      case DomainVariant.Labs:
        return 'https://a.storyblok.com/f/152463/900x472/b289c484e3/qslabs-logo-opengraph-size.png';
      default:
        return '';
    }
  };
  const defaultAlt = (variant: DomainVariant): string => {
    switch (variant) {
      case DomainVariant.Quansight:
        return 'Quansight logo';
      case DomainVariant.Labs:
        return 'Quansight Labs logo';
      default:
        return '';
    }
  };
  return (
    <Head>
      {/* twitter */}
      <meta
        name="twitter:card"
        content={summaryLargeImage ? 'summary_large_image' : 'summary'}
      />
      <meta name="twitter:site" content="@quansightai" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={twitterImage || defaultTwitterImage(variant)}
      />
      <meta
        name="twitter:alt"
        content={alt || twitterImage ? '' : defaultAlt(variant)}
      />

      {/* open-graph / LinkedIn Specification */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage || defaultOgImage(variant)} />
      <meta property="og:image:alt" content={alt || defaultAlt(variant)} />
      <meta
        property="og:image:alt"
        content={alt || ogImage ? '' : defaultAlt(variant)}
      />
    </Head>
  );
};
