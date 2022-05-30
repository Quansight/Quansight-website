import React, { FC } from 'react';

import { GetStaticProps } from 'next';

import { ISlugParams } from '@quansight/shared/types';
import {
  Layout,
  SEO,
  DomainVariant,
  Footer,
} from '@quansight/shared/ui-components';
import { isPageType } from '@quansight/shared/utils';

import { getArticleItems } from '../../api/utils/getArticleItems';
import { getFooter } from '../../api/utils/getFooter';
import { getLibraryLinkItems } from '../../api/utils/getLibraryLinkItems';
import { getPage } from '../../api/utils/getPage';
import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { Carousel } from '../../components/Carousel/Carousel';
import { Newsletter } from '../../components/Newsletter/Newsletter';
import { Page } from '../../components/Page/Page';
import { Tiles } from '../../components/Tiles/Tiles';
import { TLibraryProps } from '../../types/storyblok/bloks/libraryProps';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';
import { getLibraryTiles } from '../../utils/getLibraryTiles/getLibraryTiles';

export const Library: FC<TLibraryProps> = ({
  data,
  footer,
  header,
  tiles,
  preview,
}) => {
  return (
    <Layout footer={<Footer {...footer.content} />}>
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
      <div className="px-8 mx-auto lg:px-40 xl:px-[30rem] max-w-layout">
        <Carousel tiles={tiles} />
        {/* TODO: types / categories */}
        <Tiles tiles={tiles} />
        <Newsletter />
        {/* TODO: pagination */}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<
  TLibraryProps,
  ISlugParams
> = async ({ preview = false }) => {
  const data = await getPage({ slug: 'library' });
  const footer = await getFooter();
  const libraryLinks = await getLibraryLinkItems();
  const articleItems = await getArticleItems();

  return {
    props: {
      data,
      footer,
      tiles: getLibraryTiles({
        articleItems,
        libraryLinks,
      }),

      preview,
    },
  };
};

export default Library;
