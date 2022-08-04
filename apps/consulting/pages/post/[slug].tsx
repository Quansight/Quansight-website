import { FC } from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';

import { ISlugParams, DomainVariant } from '@quansight/shared/types';
import { Layout, SEO, Footer, Header } from '@quansight/shared/ui-components';
import { isPageType } from '@quansight/shared/utils';

import { getFooter } from '../../api/utils/getFooter';
import { getHeader } from '../../api/utils/getHeader';
import { getLibraryLinkItems } from '../../api/utils/getLibraryLinkItems';
import { getLinks } from '../../api/utils/getLinks';
import { getPage } from '../../api/utils/getPage';
import { getPageItems } from '../../api/utils/getPageItems';
import { BlogMoreArticles } from '../../components/BlogArticle/BlogMoreArticles/BlogMoreArticles';
import { LIBRARY_AUTHOR_RELATION } from '../../components/BlogArticle/constants';
import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { Page } from '../../components/Page/Page';
import { TLibraryArticleProps } from '../../types/storyblok/bloks/libraryArticleProps';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';
import { ARTICLES_DIRECTORY_SLUG } from '../../utils/getArticlesPaths/constants';
import { getArticlesPaths } from '../../utils/getArticlesPaths/getArticlesPaths';
import { getLibraryTiles } from '../../utils/getLibraryTiles/getLibraryTiles';
import { getSameCategoryTiles } from '../../utils/getSameCategoryTiles/getSameCategoryTiles';

const Article: FC<TLibraryArticleProps> = ({
  data,
  header,
  footer,
  preview,
  moreArticles,
}) => {
  const { content } = data;

  return (
    <Layout
      footer={<Footer {...footer.content} />}
      header={
        <Header {...header.content} domainVariant={DomainVariant.Quansight} />
      }
    >
      <SEO
        title={content.title}
        description={content.description}
        variant={DomainVariant.Quansight}
      />
      {isPageType(data?.content?.component) && (
        <Page data={data} preview={preview} relations={LIBRARY_AUTHOR_RELATION}>
          {(blok: TRawBlok) => <BlokProvider blok={blok} />}
        </Page>
      )}
      {moreArticles && <BlogMoreArticles tiles={moreArticles} />}
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const links = await getLinks();

  return {
    paths: getArticlesPaths(links),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  TLibraryArticleProps,
  ISlugParams
> = async ({ params: { slug }, preview = false }) => {
  const data = await getPage(
    {
      slug: `${ARTICLES_DIRECTORY_SLUG}${slug}`,
      relations: LIBRARY_AUTHOR_RELATION,
    },
    preview,
  );
  const footer = await getFooter(preview);
  const header = await getHeader(preview);
  const libraryLinks = await getLibraryLinkItems(preview);
  const blogArticles = await getPageItems(
    {
      relations: LIBRARY_AUTHOR_RELATION,
      prefix: ARTICLES_DIRECTORY_SLUG,
    },
    preview,
  );
  const libraryTiles = getLibraryTiles({
    blogArticles,
    libraryLinks,
  });

  const currentPostCategories = data.content.body.find(
    (item) => item.category,
  ).category;
  const currentPostID = data.uuid;

  return {
    props: {
      data,
      header,
      footer,
      moreArticles: getSameCategoryTiles(
        libraryTiles,
        currentPostCategories,
        currentPostID,
      ),
      preview,
    },
  };
};

export default Article;
