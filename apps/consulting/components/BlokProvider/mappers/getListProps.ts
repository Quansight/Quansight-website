import { TListProps } from '../../List/List';
import { TListRawData } from '../../../types/storyblok/bloks/list';
import { getUrl } from '@quansight/shared/ui-components';

export const getListProps = (blok: TListRawData): TListProps => ({
  grid: blok.grid.map(
    ({ _uid, image: { alt, filename }, title, text, linkTitle, linkUrl }) => ({
      _uid,
      imageSrc: filename,
      imageAlt: alt,
      title,
      text,
      linkTitle: linkTitle,
      linkUrl: getUrl(linkUrl),
    }),
  ),
  linkTitle: blok.linkTitle,
  linkUrl: getUrl(blok.linkUrl),
});
