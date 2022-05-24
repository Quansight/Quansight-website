import React, { FC } from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';

import { Api } from '@quansight/shared/storyblok-sdk';
import {
  ISlugParams,
  TContainerProps,
  DomainVariant,
} from '@quansight/shared/types';
import { Page, Layout, SEO } from '@quansight/shared/ui-components';
import { isPageType, getPaths } from '@quansight/shared/utils';

import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlock';

const Container: FC<TContainerProps> = ({ data, footer, header, preview }) => (
  <Layout footer={footer} header={header} variant={DomainVariant.Labs}>
    <SEO
      title={data.content.title}
      description={data.content.description}
      variant={DomainVariant.Labs}
    />
    {isPageType(data?.content?.component) && (
      <Page data={data} preview={preview}>
        {(blok: TRawBlok) => <BlokProvider blok={blok} />}
      </Page>
    )}
  </Layout>
);

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await Api.getLinks();
  return {
    paths: getPaths(data?.Links.items),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  TContainerProps,
  ISlugParams
> = async ({ params: { slug }, preview = false }) => {
  const { data } = await Api.getPageItem({ slug });
  const { data: footer } = await Api.getFooterItem();
  const { data: header } = await Api.getHeaderItem();

  return {
    props: {
      data: data.PageItem,
      footer: footer ? footer.FooterItem : null,
      header: header ? header.HeaderItem : null,
      preview,
    },
  };
};

export default Container;
