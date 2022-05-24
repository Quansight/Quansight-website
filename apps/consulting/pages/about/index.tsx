import React, { FC } from 'react';

import { GetStaticProps } from 'next';

import { Api } from '@quansight/shared/storyblok-sdk';
import {
  ISlugParams,
  TContainerProps,
  DomainVariant,
} from '@quansight/shared/types';
import { Page, Layout, SEO } from '@quansight/shared/ui-components';
import { isPageType, getAboutPageData } from '@quansight/shared/utils';

import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';

export const About: FC<TContainerProps> = ({
  data,
  footer,
  header,
  preview,
}) => (
  <Layout footer={footer} header={header} variant={DomainVariant.Quansight}>
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
> = async () => {
  const { data } = await Api.getPageItem({ slug: 'about' });
  const { data: footer } = await Api.getFooterItem();
  const { data: header } = await Api.getHeaderItem();
  const TeamItem = await Api.getTeamItem();

  const aboutPageData = getAboutPageData(
    data.PageItem,
    // @ts-ignore TODO missing unused query properties from sb
    TeamItem.data.PersonItems.items,
  );

  return {
    props: {
      data: aboutPageData,
      footer: footer ? footer.FooterItem : null,
      header: header ? header.HeaderItem : null,
      preview: false,
    },
  };
};

export default About;
