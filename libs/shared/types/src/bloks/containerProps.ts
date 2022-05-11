import {
  PageItem,
  FooterItem,
  PersonItems,
} from '@quansight/shared/storyblok-sdk';

export type TContainerProps = {
  data: PageItem;
  footer: FooterItem;
  team?: PersonItems;
  preview: boolean;
};
