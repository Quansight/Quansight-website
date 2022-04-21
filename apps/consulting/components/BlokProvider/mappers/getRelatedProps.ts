import { TRelatedProps } from '../../Related/types';
import { TRelatedRawData } from '../../../types/storyblok/bloks/related';
import { getUrl } from '@quansight/shared/utils';

export const getRelatedProps = (blok: TRelatedRawData): TRelatedProps => ({
  title: blok.title,
  items: blok.items.map((item) => ({
    _uid: item._uid,
    title: item.title,
    imageSrc: item.image.filename,
    imageAlt: item.image.alt,
    linkUrl: item.linkUrl ? getUrl(item.linkUrl) : '',
  })),
});
