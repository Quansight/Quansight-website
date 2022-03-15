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
      link_title,
      link_url: cached_url,
      image_src: filename,
      image_alt: alt,
    }),
  ),
  button: {
    button_title: blok.button_title,
    button_url: blok.button_url.cached_url,
  },
});
