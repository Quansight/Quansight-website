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

type TContainerProps = {
  data: PageItem;
  preview: boolean;
};

const Container: FC<TContainerProps> = ({ data, preview }) => {
  const previewMode = usePreviewMode(preview);
  console.log('previewMode:', previewMode);

  const story = useStoryblok(data, preview);
  console.log('STORY', story);
  return (
    <>
      {story?.content?.component === 'page' && (
        <Page body={story?.content?.body} />
      )}
    </>
  );
};

const dataSdk = getSdk(apolloClient);

export const getStaticPaths: GetStaticPaths = async () => {
  const result = await dataSdk.getLinks();

  return {
    paths: result ? getPaths(result?.data?.Links.items) : {},
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  TContainerProps,
  ISlugParams
> = async ({ params: { slug }, preview = false }) => {
  const data = await dataSdk.getPageItem({ slug });

  return {
    props: {
      data: data?.data.PageItem,
      preview,
    },
  };
};

export default Container;
