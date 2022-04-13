import React, { FC } from 'react';
import { GetStaticProps } from 'next';

import { Api } from '@quansight/shared/storyblok-sdk';
import {
  Page,
  Layout,
  SEO,
  DomainVariant,
} from '@quansight/shared/ui-components';
import { BlokProvider } from '../components/BlokProvider/BlokProvider';

import { isPageType } from '../services/contentTypes/isPageType';

import { ISlugParams, TContainerProps } from '@quansight/shared/types';
import { TRawBlok } from '../types/storyblok/bloks/rawBlok';

export const Index: FC<TContainerProps> = ({ data, layout, preview }) => (
  <Layout layout={layout}>
    <SEO
      title={data.content.title}
      description={data.content.description}
      variant={DomainVariant.Quansight}
    />
    {isPageType(data?.content?.component) && (
      <Page data={data} preview={preview}>
        {(blok: TRawBlok) => <BlokProvider blok={blok} />}
      </Page>
    )}
  </Layout>
);

export const getStaticProps: GetStaticProps<
  TContainerProps,
  ISlugParams
> = async () => {
  const { data } = await Api.getPageItem({ slug: 'homepage' });
  const { data: layout } = await Api.getLayoutItem({ slug: 'layout/layout' });
  return {
    props: {
      data: data.PageItem,
      layout: layout.LayoutItem,
      preview: false,
    },
  };
};

export default Index;
