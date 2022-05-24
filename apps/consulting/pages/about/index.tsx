import React, { FC } from 'react';

import { GetStaticProps } from 'next';

import { ISlugParams, TContainerProps } from '@quansight/shared/types';
import { Layout, SEO, DomainVariant } from '@quansight/shared/ui-components';
import { isPageType, getAboutPageData } from '@quansight/shared/utils';

import { getFooter } from '../../api/utils/getFooter';
import { getPage } from '../../api/utils/getPage';
import { getTeam } from '../../api/utils/getTeam';
import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { Page } from '../../components/Page/Page';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';

export const About: FC<TContainerProps> = ({ data, footer, preview }) => (
  <Layout footer={footer}>
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
  const data = await getPage({ slug: 'about' });
  const footer = await getFooter();
  const TeamItem = await getTeam();

  const aboutPageData = getAboutPageData(
    data,
    // @ts-ignore TODO missing unused query properties from sb
    TeamItem.data.PersonItems.items,
  );

  return {
    props: {
      data: aboutPageData,
      footer: footer,
      preview: false,
    },
  };
};

export default About;
