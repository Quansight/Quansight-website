import React, { FC } from 'react';

import { GetStaticProps } from 'next';

import { ISlugParams } from '@quansight/shared/types';
import {
  Layout,
  SEO,
  DomainVariant,
  Footer,
} from '@quansight/shared/ui-components';
import { isPageType } from '@quansight/shared/utils';

import { getFooter } from '../api/utils/getFooter';
import { getPage } from '../api/utils/getPage';
import { BlokProvider } from '../components/BlokProvider/BlokProvider';
import { Page } from '../components/Page/Page';
import { TContainerProps } from '../types/containerProps';
import { TRawBlok } from '../types/storyblok/bloks/rawBlok';

export const Index: FC<TContainerProps> = ({ data, footer, preview }) => (
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
  </Layout>
);

export const getStaticProps: GetStaticProps<
  TContainerProps,
  ISlugParams
> = async ({ preview = false }) => {
  const data = await getPage({ slug: 'homepage' });
  const footer = await getFooter();
  return {
    props: {
      data,
      footer,
      preview,
    },
  };
};

export default Index;
