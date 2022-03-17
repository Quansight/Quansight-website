import { ComponentType, TBlokComponentProps, TConsultingBlok } from '../types';

import { getTeaserProps } from '../mappers/getTeaserProps';
import { TTeaserRawData } from '../../../types/storyblok/bloks/teaser';

import { getBoardProps } from '../mappers/getBoardProps';
import { TBoardRawData } from '../../../types/storyblok/bloks/board';

export const getPropsByType = (blok: TConsultingBlok): TBlokComponentProps => {
  switch (blok.component.toString()) {
    case 'teaser':
      return (
        {
          [ComponentType.Teaser]: getTeaserProps(
            blok as TConsultingBlok<TTeaserRawData>,
          ),
        }[blok.component] || null
      );
    case 'board':
      return (
        {
          [ComponentType.Board]: getBoardProps(
            blok as TConsultingBlok<TBoardRawData>,
          ),
        }[blok.component] || null
      );
  }

  // return (
  //   {
  //     [ComponentType.Teaser]: getTeaserProps(
  //       blok as TConsultingBlok<TTeaserRawData>,
  //     ),
  //     [ComponentType.Board]: getBoardProps(
  //       blok as TConsultingBlok<TBoardRawData>,
  //     ),
  //   }[blok.component] || null
  // );
};
