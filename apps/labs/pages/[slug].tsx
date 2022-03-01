import React, { FC } from 'react';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from 'next';
import {
  apolloClient,
  getSdk,
  PageItem,
  usePreviewMode,
  useStoryblok,
} from '@quansight/shared/storyblok-sdk';

import Page from '../components/Page/Page';
import { getPaths } from '../services/getPaths/getPaths';
import { ISlugParams } from '../types/graphql/slug';
import { isPageType } from '../services/contentTypes/isPageType';

type TContainerProps = {
  data: PageItem;
  preview: boolean;
};

const Container: FC<TContainerProps> = ({ data, preview }) => {
  usePreviewMode(preview);

  const story = useStoryblok(data, preview);

  return (
    <>
      {isPageType(story?.content?.component) && (
        <Page body={story?.content?.body} />
      )}
    </>
  );
};

const dataSdk = getSdk(apolloClient);

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await dataSdk.getLinks();

  return {
    paths: data ? getPaths(data?.data?.Links.items) : [],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  TContainerProps,
  ISlugParams
> = async ({ params: { slug }, preview = false }) => {
  const data = await dataSdk.getPageItem({ slug });
  console.log(data)
  return {
    props: {
      data: data?.data.PageItem,
      preview,
    },
  };
};

export default Container;
