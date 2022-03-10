import { TTeaserProps } from '../../Teaser/Teaser';
import { TConsultingBlok } from '../types';

export const getTeaserProps = (
  blok: TConsultingBlok<TTeaserProps>,
): TTeaserProps => {
  return {
    headline: blok.headline,
  };
};
