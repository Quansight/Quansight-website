import { FC, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css/bundle';
import { A11y, Autoplay, Keyboard } from 'swiper';

import { CarouselItem } from './CarouselItem';
import { CarouselPagination } from './CarouselPagination';
import { TCarouselProps } from './types';
import { getCarouselProps } from './utils/getSliderProps';

export const Carousel: FC<TCarouselProps> = ({ tiles }) => {
  const data = getCarouselProps(tiles);
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="pb-[8.1rem] sm:pb-[5.3rem]">
      <Swiper
        spaceBetween={50}
        speed={500}
        modules={[A11y, Autoplay, Keyboard]}
        a11y={{
          enabled: true,
          containerMessage: `Recent posts carousel with ${data.length} items`,
          slideRole: 'group',
        }}
        autoplay={{
          delay: 2000,
        }}
        keyboard={{
          enabled: true,
        }}
        onSlideChange={(item) => {
          setCurrentSlide(item.realIndex);
        }}
      >
        {data.map((slide) => (
          <SwiperSlide key={slide.uuid}>
            <CarouselItem {...slide} />
          </SwiperSlide>
        ))}
        <CarouselPagination
          slidesLength={data.length}
          currentSlide={currentSlide}
        />
      </Swiper>
    </section>
  );
};
