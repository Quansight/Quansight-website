import { FC } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { DomainVariant } from '@quansight/shared/types';

import { TSocailCardProps } from './types';

export const SocialCard: FC<TSocailCardProps> = ({
  title,
  description,
  variant,
  twitterCardImgUrl,
  openGraphCardImgUrl,
  cardImgAlt,
}) => {
  const { asPath } = useRouter();
  const fallBackOrigin =
    DomainVariant[variant] === 'Quansight'
      ? 'https://quansight.com'
      : 'https://labs.quansight.org';
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : fallBackOrigin;
  const url = `${origin}${asPath}`;

  const twitterCardImg = (): string => {
    if (twitterCardImgUrl) {
      return twitterCardImgUrl;
    } else {
      return DomainVariant[variant] === 'Quansight'
        ? 'https://a.storyblok.com/f/147759/1200x1200/86c1d25b6a/quansight-logo-twittersquare.png'
        : 'https://a.storyblok.com/f/152463/700x700/ea6ce93c47/qslabs-logo-twittersquare.png';
    }
  };
  const openGraphCardImg = (): string => {
    if (openGraphCardImgUrl) {
      return openGraphCardImgUrl;
    } else {
      return DomainVariant[variant] === 'Quansight'
        ? 'https://a.storyblok.com/f/147759/1200x630/8b20f86b2a/quansight-logo-opengraph-size.png'
        : 'https://a.storyblok.com/f/152463/900x472/b289c484e3/qslabs-logo-opengraph-size.png';
    }
  };
  const renderCardImgAlt = (): string => {
    if (cardImgAlt) {
      return cardImgAlt;
    } else {
      return DomainVariant[variant] === 'Quansight'
        ? 'Quansight logo'
        : 'Quansight labs logo';
    }
  };
  return (
    <Head>
      {/* twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@quansightai" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterCardImg()} />
      <meta name="twitter:alt" content={renderCardImgAlt()} />

      {/* open-graph / LinkedIn Specification */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={openGraphCardImg()} />
      <meta property="og:image:alt" content={renderCardImgAlt()} />
    </Head>
  );
};
