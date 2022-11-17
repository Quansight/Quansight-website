import { TTiles } from '../../../../types/storyblok/bloks/libraryProps';
import { MAX_CAROUSEL_SLIDES } from '../../constants';

export const sliceCarouselTiles = (libraryTiles: TTiles): TTiles =>
  libraryTiles.length <= MAX_CAROUSEL_SLIDES
    ? libraryTiles
    : libraryTiles.slice(0, MAX_CAROUSEL_SLIDES);
