import { FooterItem, HeaderItem, PageItem } from '../../../api/types/basic';
import { TLibraryFilter } from '../../utils/LibraryFilter';

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
  postCategory: string[];
  title: string;
  author: string;
  date: string;
  link: TLinkData;
  uuid: string;
};

export type TTiles = TTile[];

export type TLibraryProps = {
  libraryTypes: TLibraryFilter;
  libraryCategories: TLibraryFilter;
  data: PageItem;
  header: HeaderItem;
  footer: FooterItem;
  preview: boolean;
  tiles: TTiles;
  carouselTiles: TTiles;
};
