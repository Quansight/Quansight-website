import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export enum Categories {
  MachineLearning = 'Machine Learning',
  DataVisualization = 'Data Visualization',
  ArrayAPI = 'Array API',
  PyDataEcosystem = 'PyData ecosystem',
  Accessibility = 'Accessibility',
  Funding = 'Funding',
  Community = 'Comunity',
  DeveloperWorkflows = 'Developer workflows',
  IDEs = 'IDEs',
}

export type TPostAuthor = {
  nickName: string;
  fullName: string;
  avatarSrc: string;
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
  category?: Categories;
  featuredImage: TFeaturedImage;
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
