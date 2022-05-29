import React, { FC, useState, useEffect } from 'react';

import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { ISlugParams } from '@quansight/shared/types';
import {
  Layout,
  SEO,
  DomainVariant,
  Footer,
} from '@quansight/shared/ui-components';
import { isPageType } from '@quansight/shared/utils';

import { PAGINATION_OFFSETT } from '../..//utils/paginateLibraryTiles/constants';
import { paginateLibraryTiles } from '../..//utils/paginateLibraryTiles/paginateLibraryTiles';
import { getDataSourceEntries } from '../../api/utils/getDataSourceEntries';
import { getFooter } from '../../api/utils/getFooter';
import { getLibraryArticleItems } from '../../api/utils/getLibraryArticleItems';
import { getLibraryLinkItems } from '../../api/utils/getLibraryLinkItems';
import { getPage } from '../../api/utils/getPage';
import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { Carousel } from '../../components/Carousel/Carousel';
import { Filters } from '../../components/Filters/Filters';
import { Page } from '../../components/Page/Page';
import { Pagination } from '../../components/Pagination/Pagination';
import { Tiles } from '../../components/Tiles/Tiles';
import { TLibraryProps } from '../../types/storyblok/bloks/libraryProps';
import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';
import { filterLibraryTiles } from '../../utils/filterLibraryTiles/filterLibraryTiles';
import { getLibraryTiles } from '../../utils/getLibraryTiles/getLibraryTiles';

export const Library: FC<TLibraryProps> = ({
  data,
  footer,
  tiles,
  preview,
  postTypes,
  postCategories,
}) => {
  const [postType, setPostType] = useState<string>('all');
  const [postCategory, setPostCategory] = useState<string>('all categories');
  const [libraryTiles, setLibraryTiles] = useState<TTiles>([]);
  const [paginationPages, serPaginationPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>();

  const router = useRouter();

  useEffect(() => {
    const filteredItems = filterLibraryTiles(tiles, postType, postCategory);
    serPaginationPages(Math.ceil(filteredItems.length / PAGINATION_OFFSETT));
    const filterPagination = paginateLibraryTiles(filteredItems, currentPage);
    setLibraryTiles(filterPagination);
  }, [postCategory, currentPage, postType, tiles]);

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.type) {
      setPostType(router.query.type as string);
    }

    if (router.query.category) {
      setPostCategory(router.query.category as string);
    }

    if (router.query.page) {
      setCurrentPage(parseInt(router.query.page as string, 10));
    }

    if (!router.query.page) setCurrentPage(1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

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
        <Filters
          postTypes={postTypes}
          postCategories={postCategories}
          postType={postType}
          setPostType={setPostType}
          postCategory={postCategory}
          setPostCategory={setPostCategory}
          setCurrentPage={setCurrentPage}
        />
        <Tiles tiles={libraryTiles} />
        <Pagination
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          paginationPages={paginationPages}
        />
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<
  TLibraryProps,
  ISlugParams
> = async () => {
  const data = await getPage({ slug: 'library' });
  const footer = await getFooter();
  const libraryLinks = await getLibraryLinkItems();
  const articleItems = await getLibraryArticleItems();
  const postTypes = await getDataSourceEntries({ slug: 'post-type' });
  const postCategories = await getDataSourceEntries({ slug: 'post-category' });

  return {
    props: {
      data,
      footer,
      postTypes,
      postCategories,
      tiles: getLibraryTiles({
        articleItems,
        libraryLinks,
      }),

      preview: false,
    },
  };
};

export default Library;
