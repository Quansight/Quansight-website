import { TQconsultingBtnProps } from '../../QconsultingBtn/QconsultingBtn';
import { TConsultingBlok } from '../types';

export const getQconsultingBtnProps = (
  blok: TConsultingBlok<TQconsultingBtnProps>,
): TQconsultingBtnProps => ({
  link_title: blok.link_title,
  link: blok.link,
});
