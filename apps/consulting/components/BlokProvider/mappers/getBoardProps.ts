import { TBoardProps } from '../../Board/Board';
import { TBoardRawData } from '../../../types/storyblok/bloks/board';
import { TConsultingBlok } from '../types';

export const getBoardProps = (
  blok: TConsultingBlok<TBoardRawData>,
): TBoardProps => ({
  title: blok.title,
  description: blok.description,
  grid: blok.grid.map(
    ({
      _uid,
      title,
      link_title,
      link: { cached_url },
      image: { alt, filename },
    }) => ({
      _uid,
      title,
      linkTitle: link_title,
      linkUrl: cached_url,
      imageSrc: filename,
      imageAlt: alt,
    }),
  ),
  button: {
    buttonTitle: blok.button_title,
    buttonUrl: blok.button_url.cached_url,
  },
});
