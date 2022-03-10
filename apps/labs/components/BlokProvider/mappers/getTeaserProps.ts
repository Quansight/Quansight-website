import { TTeaserProps } from '../../Teaser/Teaser';
import { TLabsBlok } from '../types';

export const getTeaserProps = (blok: TLabsBlok<TTeaserProps>): TTeaserProps => {
  return {
    headline: blok.headline,
  };
};
