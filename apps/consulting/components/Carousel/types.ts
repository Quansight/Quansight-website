import { TTile, TTiles } from '../../types/storyblok/bloks/libraryProps';

export type TCarouselProps = {
  carouselTiles: TTiles;
};

export type TCarouselItemProps = TTile;

export type TCarouselPaginationProps = {
  currentSlide: number;
  slidesLength: number;
};
