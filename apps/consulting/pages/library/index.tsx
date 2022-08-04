import React, { FC, useState, useEffect } from 'react';

import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { ISlugParams, DomainVariant } from '@quansight/shared/types';
import { Layout, SEO, Footer, Header } from '@quansight/shared/ui-components';
import { isPageType } from '@quansight/shared/utils';

import { PAGINATION_OFFSETT } from '../..//utils/paginateLibraryTiles/constants';
import { getDataSourceEntries } from '../../api/utils/getDataSourceEntries';
import { getFooter } from '../../api/utils/getFooter';
import { getHeader } from '../../api/utils/getHeader';
import { getLibraryLinkItems } from '../../api/utils/getLibraryLinkItems';
import { getPage } from '../../api/utils/getPage';
import { getPageItems } from '../../api/utils/getPageItems';
import { LIBRARY_AUTHOR_RELATION } from '../../components/BlogArticle/constants';
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
import { TileVariant } from '../../components/Tiles/types';
import { TLibraryProps } from '../../types/storyblok/bloks/libraryProps';
import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';
import { filterLibraryTiles } from '../../utils/filterLibraryTiles/filterLibraryTiles';
import { ARTICLES_DIRECTORY_SLUG } from '../../utils/getArticlesPaths/constants';
import { getCarouselTiles } from '../../utils/getLibraryTiles/getCarouselTiles';
import { getLibraryTiles } from '../../utils/getLibraryTiles/getLibraryTiles';
import { paginateLibraryTiles } from '../../utils/paginateLibraryTiles/paginateLibraryTiles';

export const Library: FC<TLibraryProps> = ({
  data,
  header,
  footer,
  tiles,
  carouselTiles,
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
    const isTheSameFilter = router.query.type === postFilters.type;
    if (isTheSameFilter || !router.query.type) return;
    setCurrentPage(1);
    setPostFilters({
      category: CATEGORIES_STARTING_VALUE,
      type: router.query.type as string,
    });
    router.push(
      {
        pathname: router.pathname,
        query: {
          page: 1,
          type: router.query.type as string,
        },
      },
      undefined,
      { shallow: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.type]);

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
        <Header
          {...header.content}
          domainVariant={DomainVariant.Quansight}
          preview={preview}
        />
      }
    >
      <SEO
        title={data.content.title}
        description={data.content.description}
        variant={DomainVariant.Quansight}
      />

      {isPageType(data?.content?.component) && (
        <Page data={data} preview={preview} relations={LIBRARY_AUTHOR_RELATION}>
          {(blok: TRawBlok) => <BlokProvider blok={blok} />}
        </Page>
      )}
      <div className="px-8 mx-auto lg:px-40 xl:px-[30rem] max-w-layout">
        {carouselTiles?.length > 0 && (
          <Carousel carouselTiles={carouselTiles} />
        )}
        <Filters
          postTypes={postTypes}
          postCategories={postCategories}
          postFilters={postFilters}
          onFiltersChange={setPostFilters}
          onPageChange={setCurrentPage}
        />
        <Tiles tiles={libraryTiles} tileVariant={TileVariant.Library} />
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
  const data = await getPage({ slug: 'library', relations: '' }, preview);
  const header = await getHeader(preview);
  const footer = await getFooter(preview);
  const blogArticles = await getPageItems(
    {
      relations: LIBRARY_AUTHOR_RELATION,
      prefix: ARTICLES_DIRECTORY_SLUG,
    },
    preview,
  );
  const libraryLinks = await getLibraryLinkItems(preview);
  const postTypes = await getDataSourceEntries({ slug: 'post-type' }, preview);
  const postCategories = await getDataSourceEntries(
    { slug: 'post-category' },
    preview,
  );

  return {
    props: {
      data,
      header,
      footer,
      postTypes,
      postCategories,
      carouselTiles: getCarouselTiles(blogArticles),
      tiles: getLibraryTiles({
        blogArticles,
        libraryLinks,
      }),
      preview,
    },
  };
};

export default Library;
