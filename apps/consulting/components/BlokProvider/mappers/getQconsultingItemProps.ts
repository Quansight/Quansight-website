import { TQconsultingItemProps } from '../../QconsultingItem/QconsultingItem';
import { TConsultingBlok } from '../types';

export const getQconsultingItemProps = (
  blok: TConsultingBlok<TQconsultingItemProps>,
): TQconsultingItemProps => ({
  title: blok.title,
  image: blok.image,
  link_title: blok.link_title,
  link: blok.link,
});
