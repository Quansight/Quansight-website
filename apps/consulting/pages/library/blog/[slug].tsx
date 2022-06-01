import { FC } from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';

import { ISlugParams, DomainVariant } from '@quansight/shared/types';
import { Layout, SEO, Footer, Header } from '@quansight/shared/ui-components';
import { isPageType } from '@quansight/shared/utils';

import { getFooter } from '../../../api/utils/getFooter';
import { getHeader } from '../../../api/utils/getHeader';
// import { getLibraryArticleItems } from '../../../api/utils/getLibraryArticleItems';
import { getLibraryLinkItems } from '../../../api/utils/getLibraryLinkItems';
import { getLinks } from '../../../api/utils/getLinks';
import { getPage } from '../../../api/utils/getPage';
import { BlogMoreArticles } from '../../../components/BlogArticle/BlogMoreArticles/BlogMoreArticles';
import { BlokProvider } from '../../../components/BlokProvider/BlokProvider';
import { Page } from '../../../components/Page/Page';
import { TLibraryArticleProps } from '../../../types/storyblok/bloks/libraryArticleProps';
import { TRawBlok } from '../../../types/storyblok/bloks/rawBlok';
import { ARTICLES_DIRECTORY_SLUG } from '../../../utils/getArticlesPaths/constants';
import { getArticlesPaths } from '../../../utils/getArticlesPaths/getArticlesPaths';
import { getLibraryTiles } from '../../../utils/getLibraryTiles/getLibraryTiles';
import { getSameCategoryTiles } from '../../../utils/getSameCategoryTiles/getSameCategoryTiles';

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
        <Page data={data} preview={preview} relations="blog-article.author">
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
  const data = await getPage({
    slug: `${ARTICLES_DIRECTORY_SLUG}${slug}`,
    relations: 'blog-article.author',
  });
  const footer = await getFooter();
  const header = await getHeader();
  const libraryLinks = await getLibraryLinkItems();
  const articleItems = undefined;
  const libraryTiles = getLibraryTiles({
    articleItems,
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
