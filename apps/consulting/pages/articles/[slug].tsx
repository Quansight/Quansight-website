import { FC } from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';

import { usePreviewMode } from '@quansight/shared/storyblok-sdk';
import { ISlugParams, TArticleProps } from '@quansight/shared/types';
import { Layout, SEO, DomainVariant } from '@quansight/shared/ui-components';

import { ARTICLES_DIRECTORY_SLUG } from '../../utils/getArticlesPaths/constants';
import { getArticlesPaths } from '../../utils/getArticlesPaths/getArticlesPaths';

import { getArticleItem } from '../../api/utils/getArticleItem';
import { getFooter } from '../../api/utils/getFooter';
import { getLinks } from '../../api/utils/getLinks';

const Article: FC<TArticleProps> = ({ data, footer, preview }) => {
  usePreviewMode(preview);
  const { content } = data;

  return (
    <Layout footer={footer}>
      <SEO
        title={content.title}
        description={content.description}
        variant={DomainVariant.Quansight}
      />
      {/* TODO: hero */}
      {/* TODO: go back link */}
      {/* TODO: meta data */}
      <h1>{content.postTitle}</h1>
      {/* TODO: article */}
      {/* TODO: read more */}
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
  TArticleProps,
  ISlugParams
> = async ({ params: { slug }, preview = false }) => {
  const data = await getArticleItem({
    slug: `${ARTICLES_DIRECTORY_SLUG}${slug}`,
  });
  const footer = await getFooter();
  return {
    props: {
      data,
      footer,
      preview,
    },
  };
};

export default Article;
