import React, { FC } from 'react';

import { GetStaticProps } from 'next';

import { ISlugParams, DomainVariant } from '@quansight/shared/types';
import { Layout, SEO, Footer, Header } from '@quansight/shared/ui-components';
import { isPageType } from '@quansight/shared/utils';

import { getFooter } from '../api';
import { getHeader } from '../api';
import { getPage } from '../api/utils/getPage';
import { BlokProvider } from '../components/BlokProvider/BlokProvider';
import { Page } from '../components/Page/Page';
import { TContainerProps } from '../types/containerProps';
import { TRawBlok } from '../types/storyblok/bloks/rawBlock';

export const Index: FC<TContainerProps> = ({
  data,
  header,
  footer,
  preview,
}) => (
  <Layout
    footer={<Footer {...footer.content} />}
    header={<Header {...header.content} domainVariant={DomainVariant.Labs} />}
  >
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

export const getStaticProps: GetStaticProps<
  TContainerProps,
  ISlugParams
> = async ({ preview = false }) => {
  const data = await getPage({ slug: 'home', relations: '' });
  const footer = await getFooter();
  const header = await getHeader();

  return {
    props: {
      data,
      header,
      footer,
      preview,
    },
  };
};

export default Index;
