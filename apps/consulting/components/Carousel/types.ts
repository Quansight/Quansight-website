import { TTiles, TTile } from '@quansight/shared/types';

export type TCarouselProps = {
  tiles: TTiles;
};

export type TCarouselItemProps = TTile;

export type TCarouselPaginationProps = {
  currentSlide: number;
  slidesLength: number;
};
