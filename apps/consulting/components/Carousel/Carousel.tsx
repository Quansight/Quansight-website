import { FC, ReactNode, useState } from 'react';

import Slider from 'react-slick';

import { CarouselItem } from './CarouselItem';
import { TCarouselProps } from './types';
import { getCarouselProps } from './utils/getSliderProps';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const Carousel: FC<TCarouselProps> = ({ tiles }) => {
  const data = getCarouselProps(tiles);
  const [current, setCurrent] = useState({ active: 0 });
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    accessibility: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: '',
    beforeChange: (_: number, next: number) => setCurrent({ active: next }),
    appendDots: (dots: ReactNode) => {
      return (
        <div>
          <ul className="flex gap-4 justify-center items-center mt-[8.8rem] sm:mt-[1.1rem]">
            {dots}
          </ul>
        </div>
      );
    },
    customPaging: (i: number) => {
      return (
        <button
          className={`w-4 h-4 rounded-full ${
            current.active === i ? 'bg-violet' : 'bg-gray'
          }`}
        />
      );
    },
  };

  return (
    <div className="overflow-hidden relative pb-[8.8rem]">
      <Slider {...settings}>
        {data.map((slide) => (
          <CarouselItem {...slide} key={slide.uuid} />
        ))}
      </Slider>
    </div>
  );
};
