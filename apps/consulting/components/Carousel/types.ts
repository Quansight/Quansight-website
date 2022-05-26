import { TTile, TTiles } from '../../types/storyblok/bloks/libraryProps';

export type TCarouselProps = {
  tiles: TTiles;
};

export type TCarouselItemProps = TTile;

export type TCarouselPaginationProps = {
  currentSlide: number;
  slidesLength: number;
};
