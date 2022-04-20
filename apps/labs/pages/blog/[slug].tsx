import React, { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

import path from 'path';
import { readdir } from 'fs/promises';
import { MDXRemote } from 'next-mdx-remote';
import { ISlugParams } from '@quansight/shared/types';
import { DomainVariant, Layout, SEO } from '@quansight/shared/ui-components';

import { getPost } from '../../services/api/posts/getPost';
import { TPost } from '../../types/storyblok/bloks/posts';
import { blogAllowedComponents } from '../../services/blogAllowedComponents';
import { POSTS_DIRECTORY_PATH } from '../../services/api/posts/constants';

export type TBlogPostProps = {
  post: TPost | null;
};

export const BlogPost: FC<TBlogPostProps> = ({ post }) => {
  const { content, meta } = post;
  return (
    <Layout>
      <SEO
        title={meta.title}
        description={meta.description}
        variant={DomainVariant.Labs}
      />

      <div className="prose">
        <MDXRemote {...content} components={blogAllowedComponents} />
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const postsFileNames = await readdir(path.join(POSTS_DIRECTORY_PATH));

    return {
      paths: postsFileNames.map(
        (filename) => `/blog/${filename.replace(/\.(md|mdx)$/, '')}`,
      ),
      fallback: false,
    };
  } catch (error) {
    console.log(error);

    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps<
  TBlogPostProps,
  ISlugParams
> = async ({ params: { slug } }) => {
  try {
    const post = await getPost(slug);

    return {
      props: {
        post,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        post: null,
      },
    };
  }
};

export default BlogPost;
