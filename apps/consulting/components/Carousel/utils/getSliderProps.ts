import { TTiles } from '@quansight/shared/types';

import { MAX_LIBRARY_SLIDES } from './constants';

export const getCarouselProps = (tiles: TTiles): TTiles =>
  tiles.length <= 3 ? tiles : tiles.slice(0, MAX_LIBRARY_SLIDES);
