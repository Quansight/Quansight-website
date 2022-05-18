import {
  FooterItem,
  HeaderItem,
  PageItem,
} from '@quansight/shared/storyblok-sdk';

export enum LinkTarget {
  Internal = 'internal',
  External = 'external',
}

export type TLinkData = {
  linkType: string;
  linkUrl: string;
};

export type TTile = {
  imageSrc: string;
  imageAlt: string;
  postType: string;
  title: string;
  author: string;
  date: string;
  link: TLinkData;
  uuid: string;
};

export type TTiles = TTile[];

export type TLibraryProps = {
  data: PageItem;
  footer: FooterItem;
  header: HeaderItem;
  preview: boolean;
  tiles: TTiles;
};
