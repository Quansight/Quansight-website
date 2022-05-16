import { TTiles } from '@quansight/shared/types';

import { MAX_LIBRARY_SLIDES } from './constants';

export const getSliderProps = (tiles: TTiles): TTiles => {
  const sliderData =
    tiles.length <= 3 ? tiles : tiles.slice(0, MAX_LIBRARY_SLIDES);
  return sliderData;
};
