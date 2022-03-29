import { getUrl } from '@quansight/shared/ui-components';

import { TBoardListProps } from '../../BoardList/types';
import { TBoardListRawData } from '../../../types/storyblok/bloks/boardList';

export const getBoardListProps = (
  blok: TBoardListRawData,
): TBoardListProps => ({
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
