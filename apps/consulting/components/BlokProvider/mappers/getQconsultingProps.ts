import { TQconsultingProps } from '../../Qconsulting/Qconsulting';
import { TConsultingBlok } from '../types';

export const getQconsultingProps = (
  blok: TConsultingBlok<TQconsultingProps>,
): TQconsultingProps => ({
  title: blok.title,
  description: blok.description,
});
