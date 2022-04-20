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

export type TPostMeta = {
  title: string;
  date: string;
  description?: string;
  author: string;
  tags?: Categories[];
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
