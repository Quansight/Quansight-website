import { DomainVariant } from '@quansight/shared/types';

export type TSEOProps = {
  title: string;
  description: string;
  variant: DomainVariant;
  type: string;
};

export type TMediaSEOProps = {
  image: string;
  imageAlt: string;
};

export const TwitterTag = {
  title: 'twitter:title',
  description: 'twitter:description',
  url: 'twitter:url',
  type: 'twitter:card',
};

export const mediaTags = [
  {
    image: 'twitter:image',
    imageAlt: 'twitter:image:alt',
  },
  {
    image: 'og:image',
    imageAlt: 'og:image:alt',
  },
];

export const FacebookTag = {
  title: 'og:title',
  description: 'og:description',
  url: 'og:url',
  type: 'og:type',
};
