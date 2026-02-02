import { TTiles } from '../../../../types/storyblok/bloks/libraryProps';
import { sliceCarouselTiles } from './sliceCarouselTiles';
import { sortLibraryTiles } from './sortLibraryTiles';

export const getCarouselTiles = (libraryPostsTiles: TTiles) =>
  sliceCarouselTiles(sortLibraryTiles(libraryPostsTiles));
