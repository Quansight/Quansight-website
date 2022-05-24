import React, { FC } from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';

import { ISlugParams, TContainerProps } from '@quansight/shared/types';
import { Layout, SEO, DomainVariant } from '@quansight/shared/ui-components';
import { isPageType, getPaths } from '@quansight/shared/utils';

import { getFooter, LinkEntry } from '../../api';
import { getLinks } from '../../api/utils/getLinks';
import { getPage } from '../../api/utils/getPage';
import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { Page } from '../../components/Page/Page';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlock';

const Container: FC<TContainerProps> = ({ data, footer, preview }) => (
  <Layout footer={footer}>
    <SEO
      title={data.content.title}
      description={data.content.description}
      variant={DomainVariant.Labs}
    />
    {isPageType(data?.content?.component) && (
      <Page data={data} preview={preview}>
        {(blok: TRawBlok) => <BlokProvider blok={blok} />}
      </Page>
    )}
  </Layout>
);

export const getStaticPaths: GetStaticPaths = async () => {
  const links = await getLinks();
  return {
    paths:
      getPaths<Pick<LinkEntry, 'id' | 'isFolder' | 'name' | 'slug'>>(links),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  TContainerProps,
  ISlugParams
> = async ({ params: { slug }, preview = false }) => {
  const data = await getPage({ slug });
  const footer = await getFooter();

  return {
    props: {
      data,
      footer,
      preview,
    },
  };
};

export default Container;
