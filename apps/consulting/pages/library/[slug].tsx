import React, { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

import { Api, usePreviewMode } from '@quansight/shared/storyblok-sdk';

import { Layout, SEO, DomainVariant } from '@quansight/shared/ui-components';

import {
  getArticlesPaths,
  ARTICLES_DIRECTORY_SLUG,
} from '@quansight/shared/utils';

import { ISlugParams, TContainerProps } from '@quansight/shared/types';

const Container: FC<TContainerProps> = ({ data, footer, preview }) => {
  usePreviewMode(preview);
  return (
    <Layout footer={footer}>
      <SEO
        title={data.content.title}
        description={data.content.description}
        variant={DomainVariant.Quansight}
      />
      <h1>Hello Article</h1>
      {/* TODO: hero */}
      {/* TODO: go back link */}
      {/* TODO: meta data */}
      {/* TODO: article */}
      {/* TODO: read more */}
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await Api.getLinks();
  return {
    paths: getArticlesPaths(data?.Links.items),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  TContainerProps,
  ISlugParams
> = async ({ params: { slug }, preview = false }) => {
  const { data } = await Api.getPageItem({
    slug: `${ARTICLES_DIRECTORY_SLUG}${slug}`,
  });
  const { data: footer } = await Api.getFooterItem();
  return {
    props: {
      data: data.PageItem,
      footer: footer.FooterItem,
      preview,
    },
  };
};

export default Container;
