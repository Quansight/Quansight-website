import { FC } from 'react';

import Carousel from 'nuka-carousel';

import { TSliderProps } from './types';
import { getSliderProps } from './utils/getSliderProps';

export const Slider: FC<TSliderProps> = ({ tiles }) => {
  const data = getSliderProps(tiles);

  return (
    <div>
      <Carousel>
        <img src="https://images.pexels.com/photos/11369918/pexels-photo-11369918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
        <img src="https://images.pexels.com/photos/11369918/pexels-photo-11369918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
        <img src="https://images.pexels.com/photos/11369918/pexels-photo-11369918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
        <img src="https://images.pexels.com/photos/11369918/pexels-photo-11369918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
        <img src="https://images.pexels.com/photos/11369918/pexels-photo-11369918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
      </Carousel>
    </div>
  );
};
