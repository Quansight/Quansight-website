import React, { FC } from 'react';

import { GetStaticProps } from 'next';

import {
  Api,
  PageItem,
  FooterItem,
  LibrarylinkItems,
  ArticleItems,
} from '@quansight/shared/storyblok-sdk';
import { ISlugParams } from '@quansight/shared/types';
import {
  Page,
  Layout,
  SEO,
  DomainVariant,
} from '@quansight/shared/ui-components';
import { isPageType } from '@quansight/shared/utils';

import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';

export type TLibraryProps = {
  data: PageItem;
  footer: FooterItem;
  articleItems: ArticleItems;
  libraryLinks: LibrarylinkItems;
  preview: boolean;
};

// 1. Fetch minimum blog-link / blog-article data to display links
// [x] 1.1. Create Team entries
// [x] 1.2. Create blog-link & blog-article entries ===== add off build for blog-link
// [x] 1.3. Fetch data
// [ ] 1.4. Sort Posts
// [ ] 1.5. Pass props to sections

// 2. Create Blog links from data
// 3. Create Content types from tags??
// 4. Create categories from tags??
// 5. Pass x most recent posts to carousel (SB - time to change slide, no. slides)
// 6. Create Paginations from fetched posts

export const Library: FC<TLibraryProps> = ({
  data,
  footer,
  articleItems,
  libraryLinks,
  preview,
}) => {
  console.log(articleItems);
  console.log(libraryLinks);

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
  const { data: libraryLinks } = await Api.getLibraryLinkItems();
  const { data: articleItems } = await Api.getArticleItems();
  return {
    props: {
      data: data.PageItem,
      footer: footer.FooterItem,
      libraryLinks: libraryLinks.LibrarylinkItems,
      articleItems: articleItems.ArticleItems,
      preview: false,
    },
  };
};

export default Library;
