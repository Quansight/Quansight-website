import React, { FC } from 'react';

import { usePreviewMode, useStoryblok } from '@quansight/shared/storyblok-sdk';
import {
  Page as PageUIComponent,
  TPageProps as TPageUIComponentProps,
} from '@quansight/shared/ui-components';

import { PageItem } from '../../api/types/basic';
import { getPage } from '../../api/utils/getPage';

type TPageProps = {
  preview: boolean;
  data: PageItem;
  relations?: string;
} & Pick<TPageUIComponentProps, 'children'>;

export const Page: FC<TPageProps> = ({
  data,
  preview,
  children,
  relations = '',
}) => {
  usePreviewMode(preview);

  const handlePageItemLoad = async (slug: string): Promise<PageItem> => {
    const pageItem = getPage({ slug, relations }, preview);
    return pageItem;
  };

  const story = useStoryblok<PageItem>(
    data,
    preview,
    handlePageItemLoad,
    relations,
  );

  return <PageUIComponent data={story}>{children}</PageUIComponent>;
};
