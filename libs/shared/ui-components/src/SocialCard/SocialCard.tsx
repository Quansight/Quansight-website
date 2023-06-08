import { FC } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { DomainVariant } from '@quansight/shared/types';

import { TSocialCardProps, TSocialCardPropsCustomizedImage } from './types';

export const SocialCard: FC<TSocialCardProps> = (Props) => {
  const { asPath } = useRouter();

  const isSocialCardImageCustomized = (
    cardProp: TSocialCardProps,
  ): cardProp is TSocialCardPropsCustomizedImage => {
    return (
      (cardProp as TSocialCardPropsCustomizedImage).twitterImage !== undefined
    );
  };

  const isCustom = isSocialCardImageCustomized(Props);
  const isSummaryCardLargeImage = (summaryLargeImage = true) =>
    summaryLargeImage ? 'summary_large_image' : 'summary';

  const { title, description, variant } = Props;

  /*
    url is constructed starting from https:// because 'NEXT_PUBLIC_VERCEL_URL' doesn't provide the protocol(https)
    and for og:url requires absolute URL which includes the protocol and domain name
    using the prefix NEXT_PUBLIC is used to indicate that the environment variable is public,
    meaning that it can be accessed by the browser.
    'NEXT_PUBLIC_VERCEL_URL' is set when the site is statically built, the build step inline the current value for the environment variable into the built JS file.
    This kind of URL is need because of og:url needs absolute path and allows it to use this as the correct canonical tag
    Also twitter doesn't have something similar to og:url like twitter:url.
   */
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
        content={
          isCustom
            ? isSummaryCardLargeImage(Props.summaryLargeImage)
            : 'summary_large_image'
        }
      />
      <meta name="twitter:site" content="@quansightai" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={isCustom ? Props.twitterImage : defaultTwitterImage(variant)}
      />
      <meta
        name="twitter:alt"
        content={isCustom ? Props.alt : defaultAlt(variant)}
      />

      {/* open-graph / LinkedIn Specification */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta
        property="og:image"
        content={isCustom ? Props.ogImage : defaultOgImage(variant)}
      />
      <meta
        property="og:image:alt"
        content={isCustom ? Props.alt : defaultAlt(variant)}
      />
    </Head>
  );
};
