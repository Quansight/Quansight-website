import { TTiles } from '../../types/storyblok/bloks/libraryProps';
import { MAX_LIBRARY_SLIDES } from './constants';

export const sliceCarouselTiles = (tiles: TTiles): TTiles =>
  tiles.length <= MAX_LIBRARY_SLIDES
    ? tiles
    : tiles.slice(0, MAX_LIBRARY_SLIDES);
