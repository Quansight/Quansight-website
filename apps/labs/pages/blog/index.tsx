import React, { FC } from 'react';
import { GetStaticProps } from 'next';

import { ISlugParams } from '@quansight/shared/types';
import { DomainVariant, Layout, SEO } from '@quansight/shared/ui-components';

import { getAllPosts } from '../../services/api/posts/getAllPosts';
import { TPost } from '../../types/storyblok/bloks/posts';
import { Api, FooterItem } from '@quansight/shared/storyblok-sdk';

export type TBlogListProps = {
  posts: TPost[];
  footer: FooterItem;
};

export const BlogList: FC<TBlogListProps> = ({ posts, footer }) => {
  return (
    <Layout footer={footer}>
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
  const { data: footer } = await Api.getFooterItem();

  return {
    props: {
      posts: items,
      footer: footer.FooterItem,
    },
  };
};

export default BlogList;
