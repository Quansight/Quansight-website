import React, { FC } from 'react';

import { GetStaticProps } from 'next';

import { ISlugParams, DomainVariant } from '@quansight/shared/types';
import {
  Layout,
  SEO,
  Footer,
  Header,
  SocialCard,
} from '@quansight/shared/ui-components';
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
    header={
      <Header
        {...header.content}
        domainVariant={DomainVariant.Labs}
        preview={preview}
      />
    }
  >
    <SEO
      title={data.content.title}
      description={data.content.description}
      variant={DomainVariant.Labs}
    />
    <SocialCard
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
  const data = await getPage({ slug: 'home', relations: '' }, preview);
  const footer = await getFooter(preview);
  const header = await getHeader(preview);

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
