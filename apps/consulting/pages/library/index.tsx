import React, { FC, useState, useEffect } from 'react';

import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { ISlugParams, DomainVariant } from '@quansight/shared/types';
import { Layout, SEO, Footer, Header } from '@quansight/shared/ui-components';
import { isPageType } from '@quansight/shared/utils';

import { PAGINATION_OFFSETT } from '../..//utils/paginateLibraryTiles/constants';
import { paginateLibraryTiles } from '../..//utils/paginateLibraryTiles/paginateLibraryTiles';
import { getDataSourceEntries } from '../../api/utils/getDataSourceEntries';
import { getFooter } from '../../api/utils/getFooter';
import { getHeader } from '../../api/utils/getHeader';
import { getLibraryArticleItems } from '../../api/utils/getLibraryArticleItems';
import { getLibraryLinkItems } from '../../api/utils/getLibraryLinkItems';
import { getPage } from '../../api/utils/getPage';
import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { Carousel } from '../../components/Carousel/Carousel';
import { Filters } from '../../components/Filters/Filters';
import {
  TYPES_STARTING_VALUE,
  CATEGORIES_STARTING_VALUE,
} from '../../components/Filters/constants';
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
  header,
  footer,
  tiles,
  preview,
  postTypes,
  postCategories,
}) => {
  const [postFilters, setPostFilters] = useState({
    type: TYPES_STARTING_VALUE,
    category: CATEGORIES_STARTING_VALUE,
  });
  const [libraryTiles, setLibraryTiles] = useState<TTiles>([]);
  const [paginationPages, serPaginationPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>();

  const router = useRouter();

  useEffect(() => {
    const filteredItems = filterLibraryTiles(
      tiles,
      postFilters.type,
      postFilters.category,
    );
    serPaginationPages(Math.ceil(filteredItems.length / PAGINATION_OFFSETT));
    const filterPagination = paginateLibraryTiles(filteredItems, currentPage);
    setLibraryTiles(filterPagination);
  }, [postFilters.category, currentPage, postFilters.type, tiles]);

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.type) {
      setPostFilters((prevState) => ({
        ...prevState,
        type: router.query.type as string,
      }));
    }

    if (router.query.category) {
      setPostFilters((prevState) => ({
        ...prevState,
        category: router.query.category as string,
      }));
    }

    setCurrentPage(
      router.query.page ? parseInt(router.query.page as string, 10) : 1,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <Layout
      footer={<Footer {...footer.content} />}
      header={
        <Header {...header.content} domainVariant={DomainVariant.Quansight} />
      }
    >
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
          postFilters={postFilters}
          onFiltersChange={setPostFilters}
          onPageChange={setCurrentPage}
        />
        <Tiles tiles={libraryTiles} />
        <Pagination
          onPageChange={setCurrentPage}
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
> = async ({ preview = false }) => {
  const data = await getPage({ slug: 'library' });
  const header = await getHeader();
  const footer = await getFooter();
  const libraryLinks = await getLibraryLinkItems();
  const articleItems = await getLibraryArticleItems();
  const postTypes = await getDataSourceEntries({ slug: 'post-type' });
  const postCategories = await getDataSourceEntries({ slug: 'post-category' });

  return {
    props: {
      data,
      header,
      footer,
      postTypes,
      postCategories,
      tiles: getLibraryTiles({
        articleItems,
        libraryLinks,
      }),
      preview,
    },
  };
};

export default Library;
