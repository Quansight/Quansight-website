import React, { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import {
  PageItem,
  usePreviewMode,
  useStoryblok,
  Api,
} from '@quansight/shared/storyblok-sdk';

import Page from '../../components/Page/Page';
import { getPaths } from '../../services/getPaths/getPaths';
import { ISlugParams } from '../../types/graphql/slug';
import { isPageType } from '../../services/contentTypes/isPageType';

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

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await Api.getLinks();
  console.log(getPaths(data?.Links.items));
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
