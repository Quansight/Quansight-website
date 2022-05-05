import React, { FC } from 'react';
import { GetStaticProps } from 'next';

import { Api } from '@quansight/shared/storyblok-sdk';
import {
  Page,
  Layout,
  SEO,
  DomainVariant,
} from '@quansight/shared/ui-components';
import { BlokProvider } from '../../components/BlokProvider/BlokProvider';

import { isPageType } from '@quansight/shared/utils';

import { ISlugParams, TContainerProps } from '@quansight/shared/types';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';

// 1. Fetch minimum blog-link / blog-article data to display links
// 2. Create Blog links from data
// 3. Create Content types from tags??
// 4. Create categories from tags??
// 5. Pass x most recent posts to carousel (SB - time to change slide, no. slides)
// 6. Create Paginations from fetched posts

export const Library: FC<TContainerProps> = ({ data, footer, preview }) => (
  <Layout footer={footer}>
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
    {/* TODO: carousel */}
    {/* TODO: types / categories */}
    {/* TODO: articles-section-1 */}
    {/* TODO: newsletter */}
    {/* TODO: articles-section-2 */}
    {/* TODO: pagination */}
  </Layout>
);

export const getStaticProps: GetStaticProps<
  TContainerProps,
  ISlugParams
> = async () => {
  const { data } = await Api.getPageItem({ slug: 'library' });
  const { data: footer } = await Api.getFooterItem();
  return {
    props: {
      data: data.PageItem,
      footer: footer.FooterItem,
      preview: false,
    },
  };
};

export default Library;
