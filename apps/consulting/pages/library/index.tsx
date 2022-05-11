import React, { FC } from 'react';

import { GetStaticProps } from 'next';

import { Api } from '@quansight/shared/storyblok-sdk';
import { ISlugParams, TLibraryProps } from '@quansight/shared/types';
import {
  Page,
  Layout,
  SEO,
  DomainVariant,
} from '@quansight/shared/ui-components';
import { isPageType, getLibraryTiles } from '@quansight/shared/utils';

import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { Tiles } from '../../components/Tiles/Tiles';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';

// 2. Create Blog links from data
// [x] 2.1. Pass tiles to component
// [ ] 2.2. Create Tile component
// [ ] 2.3. Create base Tiles Component

// 3. Create Content types from tags??
// 4. Create categories from tags??
// 5. Pass x most recent posts to carousel (SB - time to change slide, no. slides)
// 6. Create Paginations from fetched posts

export const Library: FC<TLibraryProps> = ({
  data,
  footer,
  tiles,
  preview,
}) => {
  return (
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

      <Tiles tiles={tiles} />
      {/* TODO: articles-section-1 */}
      {/* TODO: newsletter */}
      {/* TODO: articles-section-2 */}
      {/* TODO: pagination */}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<
  TLibraryProps,
  ISlugParams
> = async () => {
  const { data } = await Api.getPageItem({ slug: 'library' });
  const { data: footer } = await Api.getFooterItem();
  const {
    data: { LibrarylinkItems: libraryLinks },
  } = await Api.getLibraryLinkItems();
  const {
    data: { ArticleItems: articleItems },
  } = await Api.getArticleItems();

  return {
    props: {
      data: data.PageItem,
      footer: footer.FooterItem,
      tiles: getLibraryTiles({
        articleItems,
        libraryLinks,
      }),

      preview: false,
    },
  };
};

export default Library;
