import React, { FC } from 'react';

import { GetStaticProps } from 'next';

import { Api } from '@quansight/shared/storyblok-sdk';
import { ISlugParams, TContainerProps } from '@quansight/shared/types';
import {
  Page,
  Layout,
  SEO,
  DomainVariant,
} from '@quansight/shared/ui-components';
import { isPageType } from '@quansight/shared/utils';

import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';

// 1. Fetch minimum blog-link / blog-article data to display links
// [x] 1.1. Create Team entries
// [x] 1.2. Create blog-link & blog-article entries ===== add off build for blog-link
// [ ] 1.3. Fetch data
// [ ] 1.4. Resolve author relationship / fetch given author
// [ ] 1.5. Pass props to sections

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
