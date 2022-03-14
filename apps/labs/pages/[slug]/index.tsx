import React, { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { PageItem, Api } from '@quansight/shared/storyblok-sdk';

import { getPaths } from '../../services/getPaths/getPaths';
import { ISlugParams } from '../../types/graphql/slug';
import { isPageType } from '../../services/contentTypes/isPageType';
import { TLabsBlok } from '../../components/BlokProvider/types';
import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { Page } from '@quansight/shared/ui-components';

type TContainerProps = {
  data: PageItem;
  preview: boolean;
};

const Container: FC<TContainerProps> = ({ data, preview }) => {
  console.log({ data, preview });
  return (
    <>
      {isPageType(data?.content?.component) && (
        <Page data={data} preview={preview}>
          {(blok: TLabsBlok) => <BlokProvider blok={blok} />}
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
