import { MDXRemoteSerializeResult } from 'next-mdx-remote';

import { THeroProps } from '@quansight/shared/ui-components';

export type TPostAuthor = {
  nickName: string;
  fullName: string;
  avatarSrc: string;
  authorUrl?: {
    url: string;
  };
};

export type TFeaturedImage = {
  src: string;
  alt: string;
};

export type TPostMeta = {
  title: string;
  published: string;
  description?: string;
  author: TPostAuthor;
  category?: string[];
  featuredImage: TFeaturedImage;
  hero?:
    | Pick<THeroProps, 'imageSrc' | 'imageAlt'>
    | Pick<THeroProps, 'imageMobile' | 'imageTablet' | 'imageDesktop'>;
};

export type TPost = {
  meta: TPostMeta;
  slug: string;
  content: MDXRemoteSerializeResult;
};

export type TPostsResponse = {
  items: TPost[];
  total: number;
  offset: number;
};
