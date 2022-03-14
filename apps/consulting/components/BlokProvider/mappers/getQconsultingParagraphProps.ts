import { TQconsultingParagraphProps } from '../../QconsultingParagraph/QconsultingParagraph';
import { TConsultingBlok } from '../types';

export const getQconsultingParagraphProps = (
  blok: TConsultingBlok<TQconsultingParagraphProps>,
): TQconsultingParagraphProps => ({
  text: blok.text,
});
