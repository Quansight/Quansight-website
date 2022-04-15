import React, { FC } from 'react';
import { DomainVariant, Layout, SEO } from '@quansight/shared/ui-components';

import { getAllPosts } from '../../services/api/posts/getAllPosts';
import { TPost } from '../../types/storyblok/bloks/posts';
import { GetStaticProps } from 'next';
import { ISlugParams } from '@quansight/shared/types';

export type TBlogListProps = {
  posts: TPost[];
};

export const BlogList: FC<TBlogListProps> = ({ posts }) => {
  return (
    <Layout>
      <SEO
        title="title"
        description="description"
        variant={DomainVariant.Labs}
      />
      {posts.map((item) => {
        return <h1 key={item.slug}>{item.slug}</h1>;
      })}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<
  TBlogListProps,
  ISlugParams
> = async () => {
  const { items } = await getAllPosts();

  return {
    props: {
      posts: items,
    },
  };
};

export default BlogList;
