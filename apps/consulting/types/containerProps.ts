import { TContainerProps as TContainerPropsShared } from '@quansight/shared/types';

import { FooterItem, PageItem, HeaderItem } from '../api/types/basic';

export type TContainerProps = TContainerPropsShared<
  PageItem,
  HeaderItem,
  FooterItem
>;
