import { TBlok } from '../../types/storyblok/blok';
import { TTeaserProps } from '../../components/Teaser/Teaser';

export const getTeaserProps = (blok: TBlok<TTeaserProps>): TTeaserProps => {
  return {
    headline: blok.headline,
  };
};
