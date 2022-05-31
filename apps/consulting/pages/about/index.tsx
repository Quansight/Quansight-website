import React, { FC } from 'react';

import { GetStaticProps } from 'next';

import { ISlugParams, DomainVariant } from '@quansight/shared/types';
import { Layout, SEO, Footer, Header } from '@quansight/shared/ui-components';
import { isPageType } from '@quansight/shared/utils';

import { PageComponent, PageItem } from '../../api/types/basic';
import { getFooter } from '../../api/utils/getFooter';
import { getHeader } from '../../api/utils/getHeader';
import { getPage } from '../../api/utils/getPage';
import { getTeam } from '../../api/utils/getTeam';
import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { Page } from '../../components/Page/Page';
import { TContainerProps } from '../../types/containerProps';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';

export const About: FC<TContainerProps> = ({
  data,
  header,
  footer,
  preview,
}) => (
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

export const getStaticProps: GetStaticProps<
  TContainerProps,
  ISlugParams
> = async ({ preview = false }) => {
  const data = await getPage({ slug: 'about' });
  const footer = await getFooter();
  const header = await getHeader();
  const TeamItem = await getTeam();

  const pageData: PageItem = {
    ...data,
    content: {
      ...data.content,
      body: data.content.body.map((item: PageComponent) => {
        return item.component === 'team'
          ? { ...item, team: TeamItem.PersonItems.items }
          : { ...item };
      }),
    },
  };

  return {
    props: {
      data: pageData,
      header,
      footer,
      preview,
    },
  };
};

export default About;
