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
import { isPageType } from '@quansight/shared/utils';

import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { Slider } from '../../components/Slider/Slider';
import { Tiles } from '../../components/Tiles/Tiles';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';
import { getLibraryTiles } from '../../utils/getLibraryTiles/getLibraryTiles';

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
      <div className="px-8 mx-auto lg:px-40 xl:px-[30rem] max-w-layout">
        <Slider tiles={tiles} />
        {/* TODO: types / categories */}
        <Tiles tiles={tiles} />
        {/* TODO: newsletter */}
        {/* TODO: pagination */}
      </div>
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
