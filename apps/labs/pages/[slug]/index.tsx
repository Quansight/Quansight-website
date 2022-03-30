import React, { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

import { PageItem, Api } from '@quansight/shared/storyblok-sdk';
import { Page } from '@quansight/shared/ui-components';
import { BlokProvider } from '../../components/BlokProvider/BlokProvider';

import { getPaths } from '../../services/getPaths/getPaths';
import { isPageType } from '../../services/contentTypes/isPageType';

import { ISlugParams } from '@quansight/shared/types';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlock';
import { ContactForm } from '../../components/ContactForm/ContactForm';

type TContainerProps = {
  data: PageItem;
  preview: boolean;
};

const Container: FC<TContainerProps> = ({ data, preview }) => {
  return (
    <>
      <ContactForm title="SSSFFF" />
      {isPageType(data?.content?.component) && (
        <Page data={data} preview={preview}>
          {(blok: TRawBlok) => <BlokProvider blok={blok} />}
        </Page>
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await Api.getLinks();
  return {
    paths: getPaths(data?.Links.items),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  TContainerProps,
  ISlugParams
> = async ({ params: { slug }, preview = false }) => {
  const { data } = await Api.getPageItem({ slug });
  return {
    props: {
      data: data.PageItem,
      preview,
    },
  };
};

export default Container;
