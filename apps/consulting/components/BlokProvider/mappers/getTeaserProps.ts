import { TConsultingBlok } from '../types';
import { TTeaserProps } from '@quansight/shared/ui-components';

export const getTeaserProps = (
  blok: TConsultingBlok<TTeaserProps>,
): TTeaserProps => ({
  color: blok.color,
  image: blok.image,
  title: blok.title,
  text: blok.text,
  buttonText: blok.buttonText,
  link: blok.link,
});
