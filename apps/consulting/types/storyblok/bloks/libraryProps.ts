import { FooterItem, PageItem } from '../../../api/types/basic';

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
  tiles: TTiles;
  preview: boolean;
};
