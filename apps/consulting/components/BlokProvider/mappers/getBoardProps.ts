import { TBoardProps } from '../../Board/Board';
import { TBoard } from '../../../types/storyblok/boardTypes';
import { TConsultingBlok } from '../types';

export const getBoardProps = (blok: TConsultingBlok<TBoard>): TBoardProps => ({
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
});
