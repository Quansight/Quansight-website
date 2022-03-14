import { TConsultingBlok } from '../types';
import { TTeaserProps } from '../../Teaser/types';

export const getTeaserProps = (
  blok: TConsultingBlok<TTeaserProps>,
): TTeaserProps => ({
  color: blok.color,
  image: blok.image,
  title: blok.title,
  text: blok.text,
  btn: blok.btn,
  link: blok.link,
});
