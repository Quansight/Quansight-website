import {
  PageItem,
  FooterItem,
  HeaderItem,
} from '@quansight/shared/storyblok-sdk';

export type TContainerProps = {
  data: PageItem;
  footer: FooterItem;
  header: HeaderItem;
  preview: boolean;
};
