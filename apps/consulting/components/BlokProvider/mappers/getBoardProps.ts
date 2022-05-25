import { getUrl } from '@quansight/shared/utils';

import { TBoardRawData } from '../../../types/storyblok/bloks/board';
import { TBoardProps } from '../../Board/types';

export const getBoardProps = (blok: TBoardRawData): TBoardProps => ({
  title: blok.title,
  description: blok.description,
  grid: blok.grid.map(
    ({ _uid, title, link_title, link, image: { alt, filename } }) => ({
      _uid,
      title,
      linkTitle: link_title,
      linkUrl: getUrl(link),
      imageSrc: filename,
      imageAlt: alt,
    }),
  ),
  button: {
    buttonTitle: blok.button_title,
    buttonUrl: getUrl(blok.button_url),
  },
});
