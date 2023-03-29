import { FC } from 'react';

import Head from 'next/head';

import { DomainVariant } from '@quansight/shared/types';

import {
  FacebookTag,
  TSEOProps,
  TwitterTag,
  mediaTags,
  TMediaSEOProps,
} from './types';

export const SEO: FC<TSEOProps> = ({ title, description, variant, type }) => {
  return (
    <Head>
      <title>{`${title} | ${DomainVariant[variant]}`}</title>
      <meta name="description" content={description} />

      {metaGenerator(TwitterTag, title, description, type)}
      {metaGenerator(FacebookTag, title, description, type)}
    </Head>
  );
};

export const MediaSeo: FC<TMediaSEOProps> = ({ image, imageAlt }) => {
  console.log(image, imageAlt);
  return (
    <>
      {mediaTags.map((tag) => (
        <>
          <meta property={tag.image} content={image} />
          <meta property={tag.imageAlt} content={imageAlt} />
        </>
      ))}
    </>
  );
};
const metaGenerator = (
  dict: typeof TwitterTag | typeof FacebookTag,
  title: string,
  description: string,
  type: string,
) => {
  return (
    <>
      <meta name={dict.title} content={title} />
      <meta name={dict.description} content={description} />
      <meta name={dict.type} content={type} />
    </>
  );
};
