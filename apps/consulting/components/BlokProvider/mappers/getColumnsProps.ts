import { getUrl } from '@quansight/shared/utils';

import { TColumnsRawData } from '../../../types/storyblok/bloks/columns';
import { TColumnsProps } from '../../Columns/types';

export const getColumnsProps = (blok: TColumnsRawData): TColumnsProps => ({
  variant: blok.variant,
  columns: blok.columns.map((item) => ({
    _uid: item._uid,
    imageSrc: item.image.filename,
    imageAlt: item.image.alt,
    title: item.title,
    text: item.text,
    linkText: item.linkText,
    linkUrl: item.linkUrl ? getUrl(item.linkUrl) : '',
  })),
});
