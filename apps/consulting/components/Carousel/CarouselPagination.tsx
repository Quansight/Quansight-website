import { FC } from 'react';
import { useSwiper } from 'swiper/react';

import { TCarouselPaginationProps } from './types';

export const CarouselPagination: FC<TCarouselPaginationProps> = ({
  slidesLength,
  currentSlide,
}) => {
  const swiper = useSwiper();

  return (
    <div className="mt-[8.8rem] flex items-center justify-center gap-4 py-1 sm:mt-[1.1rem]">
      {[...Array(slidesLength).keys()].map((slideIndex) => (
        <button
          aria-label={`Go to slide ${slideIndex + 1}`}
          className={`h-4 w-4 rounded-full ${
            currentSlide === slideIndex ? 'bg-pink' : 'bg-gray-100'
          }`}
          key={slideIndex}
          onClick={() => swiper.slideTo(slideIndex)}
        />
      ))}
    </div>
  );
};
