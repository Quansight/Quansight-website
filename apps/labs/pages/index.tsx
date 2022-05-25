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

import { getFooter } from '../api';
import { getPage } from '../api/utils/getPage';
import { BlokProvider } from '../components/BlokProvider/BlokProvider';
import { Page } from '../components/Page/Page';
import { TContainerProps } from '../types/containerProps';
import { TRawBlok } from '../types/storyblok/bloks/rawBlock';

export const Index: FC<TContainerProps> = ({ data, footer, preview }) => (
  <Layout footer={<Footer {...footer.content} />}>
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
> = async () => {
  const data = await getPage({ slug: 'labs' });
  const footer = await getFooter();
  return {
    props: {
      data: data,
      footer: footer,
      preview: false,
    },
  };
};

export default Index;
