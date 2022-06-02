import React, { FC } from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';

import { ISlugParams, DomainVariant } from '@quansight/shared/types';
import { Layout, SEO, Footer, Header } from '@quansight/shared/ui-components';
import { isPageType, getPaths } from '@quansight/shared/utils';

import { LinkEntry } from '../../api/types/basic';
import { getFooter } from '../../api/utils/getFooter';
import { getHeader } from '../../api/utils/getHeader';
import { getLinks } from '../../api/utils/getLinks';
import { getPage } from '../../api/utils/getPage';
import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { Page } from '../../components/Page/Page';
import { TContainerProps } from '../../types/containerProps';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';

const Container: FC<TContainerProps> = ({ data, header, footer, preview }) => (
  <Layout
    footer={<Footer {...footer.content} />}
    header={
      <Header {...header.content} domainVariant={DomainVariant.Quansight} />
    }
  >
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
  const data = await getPage({ slug, relations: '' });
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

export default Container;
