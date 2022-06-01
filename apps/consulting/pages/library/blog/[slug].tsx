import { FC } from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';

import { usePreviewMode } from '@quansight/shared/storyblok-sdk';
import { ISlugParams, DomainVariant } from '@quansight/shared/types';
import {
  Layout,
  SEO,
  Footer,
  Header,
  Hero,
  HeroVariant,
} from '@quansight/shared/ui-components';

import { getFooter } from '../../../api/utils/getFooter';
import { getHeader } from '../../../api/utils/getHeader';
import { getLibraryArticleItem } from '../../../api/utils/getLibraryArticleItem';
import { getLibraryArticleItems } from '../../../api/utils/getLibraryArticleItems';
import { getLibraryLinkItems } from '../../../api/utils/getLibraryLinkItems';
import { getLinks } from '../../../api/utils/getLinks';
import { BlogHeader } from '../../../components/Blog/BlogHeader/BlogHeader';
import { BlogMoreArticles } from '../../../components/Blog/BlogMoreArticles/BlogMoreArticles';
import { BlogPost } from '../../../components/Blog/BlogPost/BlogPost';
import { TLibraryArticleProps } from '../../../types/storyblok/bloks/libraryArticleProps';
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
  usePreviewMode(preview);
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
      <Hero
        imageSrc={content.postImage.filename}
        imageAlt={content.postImage.alt}
        variant={HeroVariant.Small}
      />
      <article className="px-[2rem] mx-auto sm:px-[6rem] lg:px-[10rem] xl:px-[25rem] max-w-layout">
        <BlogHeader
          postTitle={content.postTitle}
          publishedDate={content.publishedDate}
          firstName={content.author.content.firstName}
          lastName={content.author.content.lastName}
          githubNick={content.author.content.githubNick}
          githubLink={content.author.content.githubLink}
          authorImage={content.author.content.image}
        />
        <BlogPost postText={content.postText} />
        {moreArticles.length !== 0 && <BlogMoreArticles tiles={moreArticles} />}
      </article>
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
  const data = await getLibraryArticleItem({
    slug: `${ARTICLES_DIRECTORY_SLUG}${slug}`,
  });
  const footer = await getFooter();
  const header = await getHeader();
  const libraryLinks = await getLibraryLinkItems();
  const articleItems = await getLibraryArticleItems();
  const libraryTiles = getLibraryTiles({
    articleItems,
    libraryLinks,
  });
  const currentPostCategories = data.content.category;

  return {
    props: {
      data,
      header,
      footer,
      moreArticles: getSameCategoryTiles(libraryTiles, currentPostCategories),
      preview,
    },
  };
};

export default Article;
